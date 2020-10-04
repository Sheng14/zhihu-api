const Koa = require('koa')
const app = new Koa()

app.use(async (ctx, next) => {
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
})

// 执行顺序 1 3 5 4 2，所谓洋葱模型，从第一个进去再进去第二个再进去第三个再退到第二个最后到第一个
// 由于执行了两次（多个favicon），可以采用fetch('/').then((res) => res.text()).then((res) => console.log(res))就只是执行一次

app.listen(3000)

/*利用github测试async await

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