const mongoose = require('mongoose')
const { Schema, model } = mongoose // 导入类和方法

const userSchema = new Schema({
    __v: { type: Number, select: false }, // 隐藏这个鬼东西
    name: { type: String, required: true },
    password: { type: Number, required: true, select: false } // 添加一个密码字段且需要隐藏
}) // 实例化一个用户Schema

module.exports = model('User', userSchema) // 将schema转换为模型导出