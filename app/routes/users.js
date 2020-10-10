const Router = require('koa-router')
const router = new Router({prefix: '/users'})
const { find, findById, update, create, del } = require('../controllers/users')



// 全部查询
router.get('/', find)

// 查询特定用户
router.get('/:id', findById)

// 新增用户
router.post('/', create)

// 更改用户信息（put一般是全部更改，不过现在加上了密码什么的就可能只是修改一部分所以用patch）
router.patch('/:id', update)

// 删除用户信息
router.delete('/:id', del)

module.exports = router