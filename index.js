const Koa = require('koa')
const app = new Koa()

app.use((ctx) => {
    ctx.body = "天下七国"
})

app.listen(3000)