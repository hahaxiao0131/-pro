const axios = require('axios');

async function AutoAnalysisQuestion(prompt) {
    const apiKey = "sk-d3aaa9f6118b426ba408b727f9a277a5";
    // 接口地址已修正为对话接口端点
    const url = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";

    // 1. 修正请求体格式：符合 OpenAI 规范，包含 model 和 messages 字段
    const data = {
        model: "qwen-plus", // 必须指定模型（根据权限选择，如 qwen-turbo、qwen-max 等）
        messages: [
            {
                role: "user", // 角色固定为 user 表示用户输入
                content: prompt // 直接使用传入的 prompt 作为内容
            }
        ]
    };

    try {
        const response = await axios.post(url, data, {
            headers: {
                'Authorization': `Bearer ${apiKey}`, // 保持正确的认证格式
                'Content-Type': 'application/json'
            },
            timeout: 30000
        });

        // 2. 修正响应结果提取：兼容 OpenAI 接口的返回格式
        if (response.status === 200 && response.data.choices && response.data.choices.length > 0) {
            return response.data.choices[0].message.content;
        } else {
            // 提取接口返回的具体错误信息
            const errorMsg = response.data.error?.message || '未知错误';
            throw new Error(`请求失败: request_id=${response.headers['x-request-id']}, 错误信息: ${errorMsg}`);
        }
    } catch (error) {
        console.error(`调用 DashScope 失败: ${error.message}`);
        // 打印完整响应错误详情（方便排查）
        if (error.response) {
            console.error("错误详情:", error.response.data);
        }
        // 处理限流等特定错误
        if (error.response && error.response.status === 429) {
            error.message = 'API 调用频率超限，请稍后再试';
        }
        throw error;
    }
}

module.exports = {
    AutoAnalysisQuestion
};