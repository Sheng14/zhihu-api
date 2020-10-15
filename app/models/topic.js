const mongoose = require('mongoose')
const { Schema, model } = mongoose // 导入类和方法

const topicSchema = new Schema({
    __v: { type: Number, select: false }, // 隐藏这个鬼东西
    name: { type: String, required: true },
    avatar_url: { type: String },
    introduction: { type: String, select: false }
},
{ timestamps: true }
)

module.exports = model('Topic', topicSchema) // 将schema转换为模型导出