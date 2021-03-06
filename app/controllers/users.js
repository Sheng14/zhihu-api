const User = require('../models/users') // 导入用户模型
const jwt = require('jsonwebtoken') // 引入jwt校验
const { secret } = require('../config') // 引入密钥
const Question = require('../models/questions')
const Answer = require('./answers') // 引入答案模型
// const { params } = require('../routes/users')
// const users = require('../models/users')

class UsersCtl {
    async find(ctx) {
        const { per_page = 3 } = ctx.query
        const page = Math.max(ctx.query.page * 1, 1) - 1
        const perPage = Math.max(per_page * 1, 1)
        ctx.body = await User
            .find({ name: new RegExp(ctx.query.q) })
            .limit(perPage)
            .skip(page * perPage) // 查找所有用户
    }
    async findById(ctx) {
        const { fields } = ctx.query
        let formatFields = ''
        let populateStr = ''
        if (fields) {
            formatFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('')
            // 将查询字符串按；拆分成数组，过滤掉空的内容，遍历让每项前面加多一个 +，再合并成字符串

            populateStr  = fields.split(';').filter(f => f).map(f => {
                if (f === 'employments') {
                    return 'employments.company employments.job'
                }
                if (f === 'educations') {
                    return 'education.school education.majot'
                }
                return f
            }).join(' ') // 这个是为了联动topic表（以前只能查到id，现在可以将id对应的信息都拿到！）
        }
        const user = await User.findById(ctx.params.id).select(formatFields).populate(populateStr) // 根据id查找用户，id无需再转换成数字！
        if (!user) {
            ctx.throw('404', '用户不存在')
        }
        ctx.body = user
    }
    async create(ctx) {
        ctx.verifyParams({
            name: { type: 'string', required: true },
            password: { type: 'number', required: true }
        })
        const { name } = ctx.request.body
        const repeatUser = await User.findOne({ name })
        if (repeatUser) {
            ctx.throw('409', '用户名已经存在')
        } // 处理唯一性的逻辑（根据用户名）
        const user = await new User(ctx.request.body).save() // 新建用户且保存到数据库
        ctx.body = user
    }
    async del(ctx) {
        const user = await User.findByIdAndRemove(ctx.params.id) // 根据id删除用户数据
        if (!user) {
            ctx.throw('404', '用户不存在')
        }
        ctx.status = 204
    }
    async update(ctx) {
        ctx.verifyParams({
            name: { type: 'string', required: false },
            password: { type: 'number', required: false },
            avatar_url: { type: 'string', required: false },
            gender: { type: 'string', required: false },
            headline: { type: 'string',required: false },
            locations: { type: 'array', itemType: 'string', required: false },
            business: { type: 'string', required: false },
            employments: { type: 'array', itemType: 'object', required: false },
            educations: { type: 'array', itemType: 'object', required: false }
        })
        const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body) // 根据id和新信息修改用户信息
        if (!user) {
            ctx.throw(404, '用户不存在')
        }
        ctx.body = user
    }
    async login(ctx) {
        ctx.verifyParams({
            name: { type: 'string', required: true },
            password: { type: 'number', required: true }
        }) // 先验证密码用户名写全了没
        const user = await User.findOne(ctx.request.body) // 通过密码用户名是否查询到东西，是就对了
        if (!user) {
            ctx.throw(401, '用户名或密码错误')
        }
        const { id, name } = user // 从查询的数据里面拿到用户名和id
        const token = jwt.sign({ id, name }, secret, { expiresIn: '1d' }) // 将用户名和id丢入token，加上密钥、设置过期时间
        ctx.body = token
    }

    async checkoutOwner (ctx, next) { // 授权，通过校验是不是自己来决定是否进行下一步操作
        if (ctx.params.id !== ctx.state.user.id) {
            ctx.throw(403, `${ctx.params.id}无权限${ctx.state.user.id}`)
        }
        await next()
    }

    async listFollowing (ctx) { // 获取关注人列表
        const user = await User.findById(ctx.params.id).select('+following').populate('following') // 找到当前用户的关注列表的关注人信息
        if (!user) {
            ctx.throw(404, '没有找到该用户')
        }
        ctx.body = user.following
    }

    async listFollowingTopics (ctx) { // 获取关注话题列表
        const user = await User.findById(ctx.params.id).select('+followingTopics').populate('followingTopics') // 找到当前用户的关注话题列表
        if (!user) {
            ctx.throw(404, '没有找到该用户')
        }
        ctx.body = user.followingTopics
    }

    async listFollower (ctx) { // 获取粉丝列表
        const users = await User.find({following: ctx.params.id}) // 只找following里面有我当前url里面id的用户！
        ctx.body = users
    }

    async checkUserExist (ctx, next) { // 校验用户是否存在
        const user = await User.findById(ctx.params.id)
        if (!user) {
            ctx.throw(404, '该用户不存在')
        }
        await next()
    }

    async follow (ctx) { // 关注用户
        const me = await User.findById(ctx.state.user.id).select('+following')
        if (!me.following.map(id => id.toString()).includes(ctx.params.id)) { // 判断当前关注人列表中有没有id和当前url的id冲突。
            me.following.push(ctx.params.id)
            me.save()
        }
        ctx.status = 204
    }
    
    async unfollow (ctx) { // 取消关注
        const me = await User.findById(ctx.state.user.id).select('+following')
        const index = me.following.map(id => id.toString()).indexOf(ctx.params.id) // 获取当前url出现的id在following里面的索引位置方便删除
        if (index > -1) {
            me.following.splice(index, 1) // 删除id
            me.save() // 保存到数据库
        }
        ctx.status = 204
    }

    async followTopic (ctx) { // 关注话题
        const me = await User.findById(ctx.state.user.id).select('+followingTopics')
        if (!me.followingTopics.map(id => id.toString()).includes(ctx.params.id)) { // 判断当前关注人列表中有没有id和当前url的id冲突。
            me.followingTopics.push(ctx.params.id)
            me.save()
        }
        ctx.status = 204
    }

    async unfollowTopic (ctx) { // 取消关注话题
        const me = await User.findById(ctx.state.user.id).select('+followingTopics')
        const index = me.followingTopics.map(id => id.toString()).indexOf(ctx.params.id) // 获取当前url出现的id在following里面的索引位置方便删除
        if (index > -1) {
            me.followingTopics.splice(index, 1) // 删除id
            me.save() // 保存到数据库
        }
        ctx.status = 204     
    }

    async listQuestions(ctx) { // 获取用户的问题列表
        const questions = await Question.find({ questioner: ctx.params.id });
        ctx.body = questions;
    }

    async listLikingAnswers (ctx) {
        const user = await User.findById(ctx.params.id).select('+likingAnswers').populate('likingAnswers')
        if (!user) {
            ctx.throw(404, '用户不存在')
        }
        ctx.body = user.likingAnswers
    }

    async likeAnswer (ctx, next) {
        const me = await User.findById(ctx.state.user.id).select('+likingAnswers')
        if (!me.likingAnswers.map(id => id.toString()).includes(ctx.params.id)) { // 判断当前关注人列表中有没有id和当前url的id冲突。
            me.likingAnswers.push(ctx.params.id)
            me.save()
            await Answer.findByIdAndUpdate(ctx.params.id, { $inc: { voteCount: 1 } }) // 投票数加1
        }
        ctx.status = 204
        await next()
    }

    async unlikeAnswer (ctx) {
        const me = await User.findById(ctx.state.user.id).select('+likingAnswers');
        const index = me.likingAnswers.map(id => id.toString()).indexOf(ctx.params.id);
        if (index > -1) {
          me.likingAnswers.splice(index, 1);
          me.save();
          await Answer.findByIdAndUpdate(ctx.params.id, { $inc: { voteCount: -1 } }); // 投票数减一
        }
        ctx.status = 204
    }

    async listDislikingAnswers(ctx) {
        const user = await User.findById(ctx.params.id).select('+dislikingAnswers').populate('dislikingAnswers');
        if (!user) { ctx.throw(404, '用户不存在'); }
        ctx.body = user.dislikingAnswers;
      }

    async dislikeAnswer(ctx, next) {
        const me = await User.findById(ctx.state.user.id).select('+dislikingAnswers');
        if (!me.dislikingAnswers.map(id => id.toString()).includes(ctx.params.id)) {
          me.dislikingAnswers.push(ctx.params.id);
          me.save();
        }
        ctx.status = 204;
        await next();
    }

    async undislikeAnswer(ctx) {
        const me = await User.findById(ctx.state.user.id).select('+dislikingAnswers');
        const index = me.dislikingAnswers.map(id => id.toString()).indexOf(ctx.params.id);
        if (index > -1) {
          me.dislikingAnswers.splice(index, 1);
          me.save();
        }
        ctx.status = 204;
    }

    async listCollectingAnswers(ctx) {
        const user = await User.findById(ctx.params.id).select('+collectingAnswers').populate('collectingAnswers');
        if (!user) { ctx.throw(404, '用户不存在'); }
        ctx.body = user.collectingAnswers;
    }

    async collectAnswer(ctx, next) {
        const me = await User.findById(ctx.state.user._id).select('+collectingAnswers');
        if (!me.collectingAnswers.map(id => id.toString()).includes(ctx.params.id)) {
          me.collectingAnswers.push(ctx.params.id);
          me.save();
        }
        ctx.status = 204;
        await next();
    }

    async uncollectAnswer(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+collectingAnswers');
        const index = me.collectingAnswers.map(id => id.toString()).indexOf(ctx.params.id);
        if (index > -1) {
          me.collectingAnswers.splice(index, 1);
          me.save();
        }
        ctx.status = 204;
    }    
}

module.exports = new UsersCtl()


/*
// 建一个内存数据库
const db = [{name: '帝国卫队'}]

class UsersCtl {
    find(ctx) {
       // a.b // 模拟500错误
        ctx.body = db
    }
    findById(ctx) {
        if (ctx.params.id *1 >= db.length) {
            ctx.throw(412, '查询的id大于数组的长度')
        } // 模拟412错误
        ctx.body = db[ctx.params.id * 1]
    }
    create(ctx) {
        ctx.verifyParams({
            name: { type: 'string', required: true },
            age: { type: 'number', required: false }
        }) // 验证body传来的参数是否正确，如果不正确会返回相应的错误信息
        db.push(ctx.request.body)
        ctx.body = ctx.request.body
    }
    del(ctx) {
        if (ctx.params.id *1 >= db.length) {
            ctx.throw(412, '查询的id大于数组的长度')
        } // 模拟412错误
        db.splice(ctx.params.id * 1, 1)
        ctx.status = 204
    }
    update(ctx) {
        if (ctx.params.id *1 >= db.length) {
            ctx.throw(412, '查询的id大于数组的长度')
        } // 模拟412错误
        ctx.verifyParams({
            name: { type: 'string', required: true },
            age: { type: 'number', required: false }
        })
        db[ctx.params.id] = ctx.request.body
        ctx.body = ctx.request.body
    }
}

module.exports = new UsersCtl()
*/