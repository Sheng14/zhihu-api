const User = require('../models/users') // 导入用户模型


class UsersCtl {
    async find(ctx) {
        ctx.body = await User.find() // 查找所有用户
    }
    async findById(ctx) {
        const user = await User.findById(ctx.params.id) // 根据id查找用户，id无需再转换成数字！
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
            password: { type: 'number', required: false }
        })
        const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body) // 根据id和新信息修改用户信息
        if (!user) {
            ctx.throw('404', '用户不存在')
        }
        ctx.body = user
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