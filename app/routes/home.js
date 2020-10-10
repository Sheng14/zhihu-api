const Router = require('koa-router')
const router = new Router()
const { index, upload } = require('../controllers/home')

router.get('/index', index)
router.post('/upload', upload) // 上传接口

module.exports = router
// 这里只需要负责路由分发，具体执行的事情直接调用控制器就行