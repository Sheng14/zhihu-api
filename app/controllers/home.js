class HomeCtl {
    index(ctx) {
        ctx.body = '这是首页'
    }
}

module.exports = new HomeCtl()

// 这里就需要负责具体逻辑方法的实现了，注意导出的是一个实例化的类