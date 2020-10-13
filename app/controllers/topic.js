const Topic = require('../models/topic') // 导入话题模型
const User = require('../models/users') // 导入用户模型

class TopicsCtl {
    async find (ctx) {
        const { per_page = 3 } = ctx.query // 获取每页多少数据，这里是为了写一个默认值
        const page = Math.max(ctx.query.page * 1, 1) - 1 // -1是因为第一页无需跳过应该给0！！
        const perPage = Math.max(per_page * 1, 1) // 预防出现小于1的情况
        ctx.body = await Topic
            .find({ name: new RegExp(ctx.query.q) }) // 加入模糊搜索（利用正则表达式）
            .limit(perPage)
            .skip(page * perPage)
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

    async checkTopicsExist (ctx, next) {
        const user = await Topic.findById(ctx.params.id)
        if (!user) {
            ctx.throw(404, '该话题不存在')
        }
        await next()
    }

    async topicListFollower (ctx) { // 获取关注该话题的用户
        const users = await User.find({followingTopics: ctx.params.id}) // 只找following里面有我当前url里面id的用户！
        ctx.body = users
    }
}

module.exports = new TopicsCtl()