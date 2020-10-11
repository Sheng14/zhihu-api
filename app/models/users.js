const mongoose = require('mongoose')
const { Schema, model } = mongoose // 导入类和方法

const userSchema = new Schema({
    __v: { type: Number, select: false }, // 隐藏这个鬼东西
    name: { type: String, required: true },
    password: { type: Number, required: true, select: false }, // 添加一个密码字段且需要隐藏
    avatar_url: { type: String },
    gender: { type: String, enum: ['male', 'female'], default: 'male' , required: true},
    headline: { type: String },
    locations: { type: [{ type: String }] },
    business: { type: String },
    employments: {
        type: [{
            company: { type: String },
            job: { type: String }
        }]
    },
    educations: {
        type: [{
            school: { type: String },
            major: { type: String },
            diploma: { type: Number, enum: [1,2,3,4,5] },
            entrance_year: { type: Number },
            graduation_year: { type: Number }
        }]
    } // 不管是啥都是{}包着里面写type，若是数组则无需写类型直接[]
}) // 实例化一个用户Schema

module.exports = model('User', userSchema) // 将schema转换为模型导出