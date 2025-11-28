const axios = require('axios');
const { filterLastUserMessage } = require('../../../helpers/MessageFilter');
require('dotenv').config();

async function AutoAddQuestion(prompt) {
    // 1. 读取环境变量中的密钥（必须是智能体所属账号的有效密钥）
    const apiKey = process.env.DASHSCOPE_API_KEY;
    if (!apiKey) throw new Error('请在 .env 中配置 DASHSCOPE_API_KEY');

    // 2. 智能体核心配置（地址+ID，原生格式专用）
    const appId = 'c2a7715acf8842fbaaaddd64448b2131';
    // 智能体原生调用地址（不是兼容OpenAI的地址！）
    const url = `https://dashscope.aliyuncs.com/api/v1/apps/${appId}/completion`;

    // 3. 处理用户输入
    const filteredMessages = filterLastUserMessage(prompt);
    const userContent = filteredMessages[0]?.content || '';
    if (!userContent) throw new Error('未获取到有效题目');

    // 4. 原生格式请求体（input.prompt 是核心字段，和兼容模式不同）
    const data = {
        input: {
            prompt: userContent // 直接传递题目内容，智能体按预设规则解析
        },
        parameters: {
            temperature: 0.2, // 控制随机性，0.2更稳定
            result_format: 'json' // 强制返回JSON格式，方便后续解析
        },
        debug: false // 关闭调试模式，减少冗余响应
    };

    try {
        const response = await axios.post(url, data, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            timeout: 30000
        });

        // 5. 原生格式响应解析（有效内容在 output.text 中）
        if (response.status === 200 && response.data.output?.text) {
            return response.data.output.text;
        } else {
            throw new Error(`智能体响应异常: ${JSON.stringify(response.data)}`);
        }
    } catch (error) {
        const errorDetails = error.response
            ? `状态码${error.response.status}，内容：${JSON.stringify(response.data)}`
            : error.message;
        console.error(`智能体调用失败: ${errorDetails}`);
        throw error;
    }
}

module.exports = { AutoAddQuestion };