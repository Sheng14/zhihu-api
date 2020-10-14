const mongoose = require('mongoose')
const { Schema, model } = mongoose // 导入类和方法

const questionSchema = new Schema({
    __v: { type: Number, select: false }, // 隐藏这个鬼东西
    title: { type: String, required: true },
    description: { type: String },
    questioner: { type: Schema.Types.ObjectId, ref: 'User', required: true, select: false },
    topics: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Topic' }],
        select: false
    }
})

module.exports = model('Question', questionSchema) // 将schema转换为模型导出