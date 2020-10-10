class HomeCtl {
    index(ctx) {
        ctx.body = '这是首页'
    }
    upload(ctx) {
        const file = ctx.request.files.file // file是上传时定义的key，可根据key不同而改变
        ctx.body = { path: file.path }
    }
}

module.exports = new HomeCtl()

// 这里就需要负责具体逻辑方法的实现了，注意导出的是一个实例化的类