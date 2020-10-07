const Koa = require('koa')
const app = new Koa()
const Router = require('koa-router')
const router = new Router()
const userRouter = new Router({prefix: '/users'})

userRouter.get('/', (ctx) => { //  全部查询应该返回数组
    ctx.body = [{name: 'D'}, {name: 'E'}]

})
userRouter.get('/:id', (ctx) => { // 单体查询，返回一个对象
    ctx.body = {name: 'D'}
})

userRouter.post('/', (ctx) => { // 增加用户，返回新建的内容
    ctx.body = {name: '新建的用户'}
})

userRouter.put('/:id', (ctx) => { // 修改用户，返回修改的内容
    ctx.body = {name: '修改后用户'}
})

userRouter.delete('/', (ctx) => { // 删除用户，返回删除成功的状态码（成功执行但是没有什么内容）
    ctx.status = 204
})

app.use(userRouter.routes())
app.listen(3000)

/*const auth = async (ctx, next) => { // 假装是校验中间件
    if (ctx.url !== '/users') {
        ctx.throw(401)
    }
    await next()
}


router.get('/index', auth, (ctx) => {
    ctx.body = '这是首页'
})

router.post('/index', auth, (ctx) => {
    ctx.body = '首页这是'
})

userRouter.get('/', auth, (ctx) => {
    ctx.body = '这是用户'
})

userRouter.get('/:id', auth, (ctx) => {
    const id = ctx.params.id
    ctx.body = `这是用户${id}`
})

// 注册路由
app.use(router.routes())
app.use(userRouter.routes())
app.use(userRouter.allowedMethods())
*/


/*
app.use(async (ctx) => {
    if (ctx.url === '/') {
        ctx.body = '这是首页'
    } else if (ctx.url === '/users') {
        if (ctx.method === 'GET') {
            ctx.body = '获取用户列表'
        } else if (ctx.method === 'POST') {
            ctx.body = '注册用户'
        } else {
            ctx.status = 405
        }
    } else if (ctx.url.match(/\/users\/\w+/)) {
        const user = ctx.url.match(/\/users\/(\w+)/)[1] // 这里必须加上（），否则只返回true/false！！！，加（）表示捕获组什么的？
        ctx.body = `当前用户${user}`
    } else {
        ctx.status = 404
    }
})
*/


/*app.use(async (ctx, next) => {
    console.log(1)
    await next()
    console.log(2)
    ctx.body = "天下七国"
})

app.use(async (ctx, next) => {
    console.log(3)
    await next()
    console.log(4)
})

app.use(async (ctx, next) => {
    console.log(5)
})*/

// 执行顺序 1 3 5 4 2，所谓洋葱模型，从第一个进去再进去第二个再进去第三个再退到第二个最后到第一个
// 由于执行了两次（多个favicon），可以采用fetch('/').then((res) => res.text()).then((res) => console.log(res))就只是执行一次


/*利用github测试async await

(
    async () => {
        const res = await fetch('//api.github.com/users')
        console.log(await res.json())
        const res2 = await fetch('//api.github.com/users/Sheng14')
        console.log(await res2.json())
    }
)()


fetch('//api.github.com/users')
    .then((res) => res.json()) //需要先转换成json格式
    .then((res) => {
        console.log(res)
        fetch('//api.github.com/users/Sheng14')
            .then((res2) => res2.json())
            .then((res2) => {
                console.log(res2)
            })
    })
*/