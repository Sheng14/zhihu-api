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