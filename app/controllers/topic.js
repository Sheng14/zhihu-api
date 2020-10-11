const Topic = require('../models/topic') // 导入话题模型

class TopicsCtl {
    async find (ctx) {
        ctx.body = await Topic.find()
    }

    async findById (ctx) {
        const { fields = '' } = ctx.query // 加上这个就可以预防不存在而报错的情况！
        /*let formatFields = ''
        if (fields) {
            formatFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('')
        }*/
        const formatFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('')
        const topic = await Topic.findById(ctx.params.id).select(formatFields)
        if (!topic) {
            ctx.throw(404, '话题不存在')
        }
        ctx.body = topic
    }

    async create (ctx) {
        ctx.verifyParams({
            name: { type: 'string', required: true },
            avatar_url: { type: 'string', required: false },
            introduction: { type: 'string', required: false }
        })
        const topic = await new Topic(ctx.request.body).save()
        ctx.body = topic
    }

    async update (ctx) {
        ctx.verifyParams({
            name: { type: 'string', required: false },
            avatar_url: { type: 'string', required: false },
            introduction: { type: 'string', required: false }
        })
        const topic = await Topic.findByIdAndUpdate(ctx.params.id, ctx.request.body)
        ctx.body = topic
    }
}

module.exports = new TopicsCtl()