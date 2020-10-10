const Koa = require('koa')
const app = new Koa()
//const Router = require('koa-router')
// const router = new Router()
// const userRouter = new Router({prefix: '/users'})
//  const bodyParser = require('koa-bodyparser')
const routing = require('./routes/index') // 引入自动化app.use.....的脚本
const error = require('koa-json-error') // 引入错误处理机制
const parameter = require('koa-parameter') // 引入参数处理机制
const mongoose = require('mongoose') // 引入mongoose处理mongodb的连接等
const { connectionStr } = require('./config') // 拿到mongodb的连接字符串
const Body = require('koa-body') // 引入支持更多请求体的插件
const path = require('path')
const koaStatic = require('koa-static') // 引入静态资源服务


mongoose.connect(connectionStr, { useUnifiedTopology: true, useNewUrlParser: true }, () => {
    console.log('连接成功！')
}) // 连接mongodb
mongoose.connection.on('error', console.error) // 监听连接中出现的错误

app.use(error({
    postFormat: (e, {stack, ...rest}) => process.env.NODE_ENV === 'production' ? rest : {stack, ...rest}
})) // 修改默认配置，判断环境给予不同的数据（给不给栈stack的问题） 这里NODE_ENV其实就是跟package.json一致就行，可以随便改！


/*app.use(async (ctx, next) => { // 错误处理的中间件（写在最前面，兜住所有后面的中间件出现的错误）
    try {
        await next() // 捕获中间件
    } catch(err) {
        ctx.status = err.status || err.statusCode || 500 // 返回错误码，500无法在前面两个拿到，所以直接写
        ctx.body = {
            "message": err.message
        } // 返回错误信息
    }
})*/

// 所以现在只需要确认body可以被访问、注册到app、监听即可！
// app.use(bodyParser())
app.use(koaStatic(path.join(__dirname, 'public'))) // 这个只是确定监听哪一个文件夹（public）下面的资源作为静态文件（就像是hs需要指定目录）
app.use(Body({
    multipart: true, // 启动查询文件
    formidable: {
        keepExtensions: true, // 是否携带后缀名
        uploadDir: path.join(__dirname, '/public/uploads') // 上传目录
    } // 格式化
})) // 调用解析请求体的插件
app.use(parameter(app)) // 使用且需要传递app方便后面全局调用
routing(app)
app.listen(3000, () => {
    console.log('程序运行')
})

/*
// 建一个内存数据库
const db = [{name: '帝国卫队'}]

// 全部查询
userRouter.get('/', (ctx) => {
    ctx.body = db
})

// 查询特定用户
userRouter.get('/:id', (ctx) => {
    ctx.body = db[ctx.params.id * 1]
})

// 新增用户
userRouter.post('/', (ctx) => {
    db.push(ctx.request.body)
    console.log(ctx.request.body)
    console.log(db)
    ctx.body = ctx.request.body
})

// 更改用户信息（一般是全部更改）
userRouter.put('/:id', (ctx) => {
    db[ctx.params.id] = ctx.request.body
    ctx.body = ctx.request.body
})

// 删除用户信息
userRouter.delete('/:id', (ctx) => {
    db.splice(ctx.params.id * 1, 1)
    ctx.status = 204
})

app.use(bodyParser()) // 这个是负责获取body参数！！！必须写在router上面！！！！！
app.use(userRouter.routes())
*/

/*
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

app.use(bodyParser())
app.use(userRouter.routes())
*/

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