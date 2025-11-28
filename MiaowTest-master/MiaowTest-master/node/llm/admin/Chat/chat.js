const OpenAI = require("openai");
const { filterLastUserMessage } = require('../../../helpers/MessageFilter');

const openai = new OpenAI(
    {
        apiKey:"sk-d3aaa9f6118b426ba408b727f9a277a5",
        baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    }
);

async function postUserSingleChat(messages, model) {
    const filteredMessages = filterLastUserMessage(messages);
    console.log('Filtered messages:', filteredMessages);
    const completion = await openai.chat.completions.create({
        model: model,
        messages: filteredMessages,
        // 添加 enable_thinking 参数
        enable_thinking: false
    });
    return {
        Aidata:completion.choices[0].message.content,
        modelName:completion.model
    }
}


module.exports = { postUserSingleChat};