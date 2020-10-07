// 建一个内存数据库
const db = [{name: '帝国卫队'}]

class UsersCtl {
    find(ctx) {
        ctx.body = db
    }
    findById(ctx) {
        ctx.body = db[ctx.params.id * 1]
    }
    create(ctx) {
        db.push(ctx.request.body)
        ctx.body = ctx.request.body
    }
    del(ctx) {
        db.splice(ctx.params.id * 1, 1)
        ctx.status = 204
    }
    update(ctx) {
        db[ctx.params.id] = ctx.request.body
        ctx.body = ctx.request.body
    }
}

module.exports = new UsersCtl()