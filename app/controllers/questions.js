const Question = require('../models/questions') // 导入问题模型

class QuestionsCtl {
    async find (ctx) {
        const { per_page = 3 } = ctx.query // 获取每页多少数据，这里是为了写一个默认值
        const page = Math.max(ctx.query.page * 1, 1) - 1 // -1是因为第一页无需跳过应该给0！！
        const perPage = Math.max(per_page * 1, 1) // 预防出现小于1的情况
        const q = new RegExp(ctx.query.q) 
        ctx.body = await Question
            .find({ $or: [{ title: q }, { description: q }] }) // 加入模糊搜索（利用正则表达式）
            .limit(perPage)
            .skip(page * perPage)
    }

    async checkQuestionExist(ctx, next) {
        const question = await Question.findById(ctx.params.id).select('+questioner');
        if (!question) { ctx.throw(404, '问题不存在'); }
        ctx.state.question = question;
        await next();
      }

    async findById (ctx) {
        const { fields = '' } = ctx.query // 加上这个就可以预防不存在而报错的情况！
        /*let formatFields = ''
        if (fields) {
            formatFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('')
        }*/
        const formatFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('')
        const question = await Question.findById(ctx.params.id).select(formatFields).populate('questioner topics')
        if (!question) {
            ctx.throw(404, '问题不存在')
        }
        ctx.body = question
    }

    async create (ctx) {
        ctx.verifyParams({
            title: { type: 'string', required: true },
            description: { type: 'string', required: false }
        })
        const question = await new Question({ ...ctx.request.body, questioner: ctx.state.user.id }).save()
        ctx.body = question
    }

    async checkQuestioner(ctx, next) {
        const { question } = ctx.state;
        if (question.questioner.toString() !== ctx.state.user.id) { ctx.throw(403, '没有权限'); }
        await next();
      }

    async update (ctx) {
        ctx.verifyParams({
            title: { type: 'string', required: false },
            description: { type: 'string', required: false }
        })
        // const question = await Question.findByIdAndUpdate(ctx.params.id, ctx.request.body)
        await ctx.state.question.update(ctx.request.body)
        ctx.body = ctx.state.question
    }


    async delete(ctx) {
        await Question.findByIdAndRemove(ctx.params.id);
        ctx.status = 204;
      }
}

module.exports = new QuestionsCtl()