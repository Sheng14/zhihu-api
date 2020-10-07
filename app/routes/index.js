const fs = require('fs')

module.exports = (app) => {
    const result = fs.readdirSync(__dirname) // 获取当前目录下面的所有文件名且是一个数组
    result.forEach((file) => {
        if (file === 'index.js') {
            return
        } // 遍历数组把是这个文件的丢了，这个不需要注册到app
        const route = require(`./${file}`) // 拿到文件名对应的文件
        app.use(route.routes()).use(route.allowedMethods()) // 注册
    })
}

// 这里是做一个自动化的脚本来批量注册当前目录下面的所有路由文件