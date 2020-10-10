const path = require('path')
class HomeCtl {
    index(ctx) {
        ctx.body = '这是首页'
    }
    upload(ctx) {
        const file = ctx.request.files.file // file是上传时定义的key，可根据key不同而改变
        const baseName = path.basename(file.path) // 拿到文件名+后缀
        ctx.body = {
            url: `${ctx.origin}/uploads/${baseName}` // 定义完整的静态资源链接，这里的uploads是存放资源的文件夹名称，origin可以动态获取
        }
    }
}

module.exports = new HomeCtl()

// 这里就需要负责具体逻辑方法的实现了，注意导出的是一个实例化的类