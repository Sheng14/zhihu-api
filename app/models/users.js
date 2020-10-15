const mongoose = require('mongoose')
const { Schema, model } = mongoose // 导入类和方法

const userSchema = new Schema({
    __v: { type: Number, select: false }, // 隐藏这个鬼东西
    name: { type: String, required: true },
    password: { type: Number, required: true, select: false }, // 添加一个密码字段且需要隐藏
    avatar_url: { type: String },
    gender: { type: String, enum: ['male', 'female'], default: 'male' , required: true},
    headline: { type: String },
    locations: { type: [{ type: Schema.Types.ObjectId, ref: 'Topic' }], select: false },
    business: { type: Schema.Types.ObjectId, ref: 'Topic', default: '互联网', select: false}, // 所有类型都会以默认值（空或者预设值）展现出来（如果是字符串没有默认值则不会展示该字段）
    employments: {
        type: [{
            company: { type: Schema.Types.ObjectId, ref: 'Topic' },
            job: { type: Schema.Types.ObjectId, ref: 'Topic' }
        }],
        select: false
    },
    educations: {
        type: [{
            school: { type: Schema.Types.ObjectId, ref: 'Topic' },
            major: { type: Schema.Types.ObjectId, ref: 'Topic' },
            diploma: { type: Number, enum: [1,2,3,4,5] },
            entrance_year: { type: Number },
            graduation_year: { type: Number }
        }],
        select: false
    }, // 不管是啥都是{}包着里面写type，若是数组则无需写类型直接[]
    following: {
        type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        select: false
    }, // 关注人列表
    followingTopics: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Topic' }],
        select: false
    }, // 关注话题列表
    likingAnswers: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
        select: false
    }, // 赞过答案列表
    dislikingAnswers: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Answer' }]
    }, // 踩过的答案列表
    collectingAnswers: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
        select: false,
    } // 收藏的答案列表
},
{ timestamps: true }
) // 实例化一个用户Schema

module.exports = model('User', userSchema) // 将schema转换为模型导出