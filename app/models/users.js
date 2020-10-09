const mongoose = require('mongoose')
const { Schema, model } = mongoose // 导入类和方法

const userSchema = new Schema({
    name: { type: String, required: true }
}) // 实例化一个用户Schema

module.exports = model('User', userSchema) // 将schema转换为模型导出