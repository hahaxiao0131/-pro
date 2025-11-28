const LLMModel = require("../../models/LLMsModel");
const ExamSelectModel = require('../../models/SelectModel');
const ExamBlankModel = require('../../models/BlankModel');
const ExamJudgeModel = require('../../models/JudgeModel');
const ExamShortModel = require('../../models/ShortModel');
const chat = require("../../llm/admin/Chat/chat");
const AutoAddQuestionmodelapp = require("../../llm/admin/ModelApp/Iaa");
const AutoAnalysisQuestionmodelapp = require("../../llm/admin/ModelApp/analysis");
const withRetry = require("../../helpers/retryUtils");

const LLMService = {
    addmodel: async ({ modelName, modelValue, isPublish, description, creator, createdTime }) => {
        return await LLMModel.create({
            modelName,
            modelValue,
            isPublish,
            description,
            creator,
            createdTime
        });
    },

    getmodel: async ({ page, size }) => {
        const skip = (page - 1) * size;
        const [data, total] = await Promise.all([
            LLMModel.find({}).skip(skip).limit(size),
            LLMModel.countDocuments({})
        ]);
        return { data, total };
    },

    updateModel: async ({ _id, modelName, modelValue, description, creator, editTime }) => {
        return await LLMModel.updateOne({ _id }, { modelName, modelValue, description, creator, editTime });
    },

    deleteOnemodel: async ({ _id }) => {
        return await LLMModel.deleteOne({ _id });
    },

    deleteManymodel: async ({ _ids }) => {
        return await LLMModel.deleteMany({ _id: { $in: _ids } });
    },

    changestatus: async ({ _id, state }) => {
        return await LLMModel.updateOne({ _id }, { isPublish: state });
    },

    useLLMChat: async (message, model) => {
        return await chat.postUserSingleChat(message, model);
    },

    getChatModels: async () => {
        return await LLMModel.find({ isPublish: 1 });
    },

    BatchaddQuestion: async (message, examId, category) => {
        try {
            const data = await AutoAddQuestionmodelapp.AutoAddQuestion(message);

            // 移除Markdown代码块标记
            const cleanData = data.replace(/```json/g, '').replace(/```/g, '').trim();

            // 处理可能的多JSON对象情况
            let jsonData;
            try {
                jsonData = JSON.parse(cleanData);
            } catch (e) {
                try {
                    jsonData = JSON.parse(`[${cleanData.replace(/}\s*{/g, '},{')}]`);
                } catch (err) {
                    console.error('JSON解析失败:', err);
                    throw new Error('数据格式错误，无法解析');
                }
            }

            // 确保jsonData是数组
            const questionsArray = Array.isArray(jsonData) ? jsonData : [jsonData];
            const updatedQuestions = questionsArray.map(item => ({
                ...item,
                examId: examId,
                isPublish: 0,
                analysis: "",
                isAIanswer: 0,
                isAddUserList: 0,
                createdTime: new Date(),
                __v: 0
            }));

            // 根据category获取对应模型
            const modelMap = {
                1: ExamSelectModel,
                2: ExamBlankModel,
                3: ExamJudgeModel,
                4: ExamShortModel
            };
            const currentModel = modelMap[category];
            if (!currentModel) throw new Error('未知题型分类');

            // 插入数据到对应的模型
            await currentModel.insertMany(updatedQuestions);

            return {
                success: true,
                message: '数据插入成功',
                count: updatedQuestions.length,
                data: updatedQuestions
            };
        } catch (error) {
            console.error('数据插入失败:', error);
            return { success: false, message: '数据插入失败', error: error.message };
        }
    },

    getQuestionAnalysis: async (message, questionType, _id) => {
        try {
            // 1. 构造带格式约束的提示词，要求AI返回JSON
            const formattedPrompt = `
                请解析以下题目，输出格式必须为JSON，且仅包含"analysis"字段（值为解析内容），不允许任何额外文本：
                题目：${message}
            `.trim();

            // 2. 调用AI接口（带重试机制）
            const data = await withRetry.withRetry(async () => {
                return await AutoAnalysisQuestionmodelapp.AutoAnalysisQuestion(formattedPrompt);
            }, 5, 2000);

            // 3. 清理AI返回内容（移除可能的Markdown标记）
            const cleanData = data.replace(/```json/g, '').replace(/```/g, '').trim();
            if (!cleanData) throw new Error('AI返回内容为空');

            // 4. 解析数据（兼容JSON和纯文本）
            let analysisContent;
            try {
                // 尝试解析为JSON（优先处理）
                const jsonData = JSON.parse(cleanData);
                analysisContent = jsonData.analysis || cleanData; // 提取analysis字段
            } catch (jsonError) {
                // 解析失败，直接使用纯文本作为分析内容
                console.warn('AI返回非JSON格式，使用纯文本解析:', cleanData);
                analysisContent = cleanData;
            }

            // 5. 根据题型更新对应模型
            const modelMap = {
                1: ExamSelectModel,
                2: ExamBlankModel,
                3: ExamJudgeModel,
                4: ExamShortModel
            };
            const currentModel = modelMap[questionType];
            if (!currentModel) throw new Error('未知题型');

            // 执行更新
            const updateResult = await currentModel.updateOne(
                { _id: _id },
                {
                    analysis: analysisContent,
                    isAIanswer: 1 // 标记为AI回答
                }
            );

            if (updateResult.modifiedCount === 0) {
                throw new Error('未找到对应题目或分析内容未变更');
            }

            return {
                success: true,
                message: '题目分析更新成功'
            };

        } catch (error) {
            console.error('获取题目分析失败:', error);

            // 处理特定错误类型
            if (error.response && error.response.status === 429) {
                return {
                    success: false,
                    message: 'API请求频率过高，请稍后再试',
                    error: 'RATE_LIMIT_EXCEEDED'
                };
            }

            return {
                success: false,
                message: '更新分析失败',
                error: error.message
            };
        }
    }
};

module.exports = LLMService;