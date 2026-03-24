"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTeacherAnalysisStats = exports.performAIAnalysis = void 0;
const axios_1 = __importDefault(require("axios"));
const Grade_1 = __importDefault(require("../models/Grade"));
const Student_1 = __importDefault(require("../models/Student"));
const Course_1 = __importDefault(require("../models/Course"));
const AnalysisRecord_1 = __importDefault(require("../models/AnalysisRecord"));
const ApiConfig_1 = __importDefault(require("../models/ApiConfig"));
// 数据脱敏函数
function desensitizeGradeData(grades) {
    return grades.map((grade, index) => ({
        studentIndex: index + 1,
        score: grade.score,
        gradeLevel: grade.gradeLevel,
        // 不返回姓名和学号，只返回序号
    }));
}
// 构建分析Prompt
function buildAnalysisPrompt(desensitizedData, dimensions, customInstruction, courseInfo) {
    const courseNamesStr = courseInfo?.courseNames.join('、') || '';
    const examTypeStr = courseInfo?.examType || '';
    let prompt = `你是一名专业的教育数据分析专家，擅长分析学生成绩数据并给出教学建议。

**分析范围**：${courseNamesStr} ${examTypeStr}
**数据样本数**：${desensitizedData.length}名学生

**成绩数据**（已脱敏，仅保留分数和等级）：
${JSON.stringify(desensitizedData, null, 2)}

**分析维度**：
${dimensions.map((d, i) => `${i + 1}. ${d}`).join('\n')}`;
    if (customInstruction) {
        prompt += `\n\n**自定义要求**：${customInstruction}`;
    }
    prompt += `

**输出要求**：
1. 输出格式必须是JSON对象，包含以下字段：
   - title: 报告标题（如"高一(1)班数学月考成绩分析报告"）
   - summary: 基础数据概览（平均分、最高分、最低分、及格率、优秀率等）
   - dimensions: 分维度分析数组，每个维度包含：
     * name: 维度名称
     * content: 该维度的详细分析（500字以内）
     * suggestions: 改进建议数组（3-5条）
   - overallSuggestions: 综合教学建议（按优先级排序，5条以内）
2. 语言简洁专业，建议可落地
3. 禁止泄露任何学生敏感信息`;
    return prompt;
}
// 调用Kimi API
async function callKimiAPI(apiConfig, prompt) {
    try {
        const response = await axios_1.default.post(apiConfig.apiEndpoint, {
            model: apiConfig.model,
            messages: [
                {
                    role: 'system',
                    content: '你是一名专业的教育数据分析专家，擅长分析学生成绩数据并给出教学建议。分析报告需结构化、语言简洁、建议可落地，禁止使用专业术语堆砌，符合中小学/高校教学场景。'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.3,
            max_tokens: 2000,
            stream: false
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiConfig.apiKey}`
            },
            timeout: 30000 // 30秒超时
        });
        const content = response.data.choices[0]?.message?.content || '';
        const tokensUsed = response.data.usage?.total_tokens || 0;
        return { content, tokensUsed };
    }
    catch (error) {
        console.error('Kimi API调用失败:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error?.message || 'API调用失败');
    }
}
// 检查教师调用限额
async function checkTeacherQuota(teacherId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = today.toISOString();
    const todayEnd = new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString();
    // 获取API配置（优先使用数据库配置）
    let apiConfig = await ApiConfig_1.default.findOne({ where: { isActive: true } });
    // 如果数据库中没有配置，使用环境变量中的默认配置
    if (!apiConfig && process.env.KIMI_API_KEY) {
        apiConfig = {
            dailyLimitPerTeacher: parseInt(process.env.KIMI_DAILY_LIMIT || '10'),
            monthlyLimitPerTeacher: parseInt(process.env.KIMI_MONTHLY_LIMIT || '100')
        };
    }
    if (!apiConfig) {
        throw new Error('未配置有效的API，请联系管理员配置');
    }
    // 统计今日调用次数
    const todayCount = await AnalysisRecord_1.default.count({
        where: {
            teacherId,
            status: ['completed', 'analyzing'],
            createdAt: {
                $between: [todayStart, todayEnd]
            }
        }
    });
    return {
        hasQuota: todayCount < apiConfig.dailyLimitPerTeacher,
        dailyLimit: apiConfig.dailyLimitPerTeacher
    };
}
// 主函数：执行AI分析
async function performAIAnalysis(analysisId) {
    try {
        // 1. 获取分析记录
        const analysisRecord = await AnalysisRecord_1.default.findByPk(analysisId);
        if (!analysisRecord) {
            throw new Error('分析记录不存在');
        }
        // 2. 检查调用限额
        const quotaCheck = await checkTeacherQuota(analysisRecord.teacherId);
        if (!quotaCheck.hasQuota) {
            throw new Error('今日API调用次数已达上限');
        }
        // 3. 更新状态为"分析中"
        await analysisRecord.update({ status: 'analyzing' });
        // 4. 获取成绩数据
        const courseIds = JSON.parse(analysisRecord.courseIds);
        const grades = await Grade_1.default.findAll({
            where: {
                course_id: courseIds
            },
            include: [
                {
                    model: Student_1.default,
                    as: 'student',
                    attributes: ['id', 'name', 'student_id']
                },
                {
                    model: Course_1.default,
                    as: 'course',
                    attributes: ['course_name', 'semester']
                }
            ]
        });
        if (grades.length === 0) {
            throw new Error('所选课程暂无成绩数据');
        }
        // 5. 数据脱敏
        const desensitizedData = desensitizeGradeData(grades);
        // 6. 构建Prompt
        const dimensions = JSON.parse(analysisRecord.analysisDimensions);
        const courseInfo = {
            courseNames: JSON.parse(analysisRecord.courseNames),
            examType: analysisRecord.examType
        };
        const prompt = buildAnalysisPrompt(desensitizedData, dimensions, analysisRecord.customInstruction, courseInfo);
        // 7. 调用Kimi API
        let apiConfig = await ApiConfig_1.default.findOne({ where: { isActive: true } });
        // 如果数据库中没有配置，使用环境变量中的默认配置
        if (!apiConfig && process.env.KIMI_API_KEY) {
            apiConfig = {
                apiEndpoint: process.env.KIMI_API_ENDPOINT || 'https://api.moonshot.cn/v1/chat/completions',
                apiKey: process.env.KIMI_API_KEY,
                model: process.env.KIMI_MODEL || 'moonshot-v1-8k'
            };
        }
        if (!apiConfig) {
            throw new Error('未配置有效的API，请联系管理员配置或设置环境变量');
        }
        const { content, tokensUsed } = await callKimiAPI(apiConfig, prompt);
        // 8. 解析返回结果
        let analysisResult;
        try {
            // 尝试从返回内容中提取JSON
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                analysisResult = JSON.parse(jsonMatch[0]);
            }
            else {
                throw new Error('无法解析AI返回结果');
            }
        }
        catch (error) {
            // 如果解析失败，创建一个基本结构
            analysisResult = {
                title: `${courseInfo.courseNames.join('、')}成绩分析报告`,
                summary: {
                    totalStudents: grades.length,
                    average: grades.reduce((sum, g) => sum + (g.score || 0), 0) / grades.length
                },
                dimensions: [{
                        name: '基础分析',
                        content: content,
                        suggestions: ['根据AI分析结果调整教学策略']
                    }],
                overallSuggestions: ['建议结合具体教学情况进行分析']
            };
        }
        // 9. 计算成本（Kimi定价：¥0.12/1K tokens）
        const estimatedCost = (tokensUsed / 1000) * 0.12;
        // 10. 更新分析记录
        await analysisRecord.update({
            status: 'completed',
            analysisResult: JSON.stringify(analysisResult),
            tokensUsed,
            estimatedCost,
            updatedAt: new Date()
        });
        return { success: true, analysisResult };
    }
    catch (error) {
        console.error('AI分析失败:', error);
        // 更新分析记录为失败状态
        const analysisRecord = await AnalysisRecord_1.default.findByPk(analysisId);
        if (analysisRecord) {
            await analysisRecord.update({
                status: 'failed',
                errorMessage: error.message,
                updatedAt: new Date()
            });
        }
        throw error;
    }
}
exports.performAIAnalysis = performAIAnalysis;
// 获取教师分析统计
async function getTeacherAnalysisStats(teacherId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = today.toISOString();
    const todayEnd = new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
    let apiConfig = await ApiConfig_1.default.findOne({ where: { isActive: true } });
    // 如果数据库中没有配置，使用环境变量中的默认配置
    if (!apiConfig && process.env.KIMI_API_KEY) {
        apiConfig = {
            dailyLimitPerTeacher: parseInt(process.env.KIMI_DAILY_LIMIT || '10'),
            monthlyLimitPerTeacher: parseInt(process.env.KIMI_MONTHLY_LIMIT || '100')
        };
    }
    const [todayCount, monthCount] = await Promise.all([
        AnalysisRecord_1.default.count({
            where: {
                teacherId,
                status: ['completed', 'analyzing'],
                createdAt: {
                    $between: [todayStart, todayEnd]
                }
            }
        }),
        AnalysisRecord_1.default.count({
            where: {
                teacherId,
                status: ['completed', 'analyzing'],
                createdAt: {
                    $gte: monthStart
                }
            }
        })
    ]);
    const dailyLimit = apiConfig?.dailyLimitPerTeacher || 10;
    const monthlyLimit = apiConfig?.monthlyLimitPerTeacher || 100;
    return {
        todayCount,
        monthCount,
        dailyLimit,
        monthlyLimit,
        remainingToday: Math.max(0, dailyLimit - todayCount),
        remainingMonth: Math.max(0, monthlyLimit - monthCount)
    };
}
exports.getTeacherAnalysisStats = getTeacherAnalysisStats;
