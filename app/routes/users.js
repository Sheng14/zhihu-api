const Router = require('koa-router')
const router = new Router({prefix: '/users'})
const { 
    find, findById, update, create, del, login, 
    checkoutOwner, listFollowing, follow, listFollower, 
    unfollow, checkUserExist, unfollowTopic, followTopic,
    listFollowingTopics
} = require('../controllers/users')

const { checkTopicsExist } = require('../controllers/topic')
// const jwt = require('jsonwebtoken')
const { secret } = require('../config')
const jwt = require('koa-jwt')

const auth = jwt({ secret })

/*const auth = async (ctx, next) => { // 用户认证，判断用户是谁来获取用户信息
    const { authorization = '' } = ctx.request.header // 拿到header中的授权信息
    console.log(authorization)
    const token = authorization.replace('Bearer ', '') // 取出token
    console.log(token)
    try {
        const user = jwt.verify(token, secret) // 根据token拿到用户信息
        console.log(user)
        ctx.state.user = user // 用户信息保存到ctx中，方便到处使用
    } catch(err) {
        ctx.throw(401, err.message)
    } // 鉴于可能拿不到用户信息报500错误，这里捕获一下返回比较友好的信息。
    await next()
}*/

// 全部查询
router.get('/', find)

// 查询特定用户
router.get('/:id', findById)

// 新增用户
router.post('/', create)

// 更改用户信息（put一般是全部更改，不过现在加上了密码什么的就可能只是修改一部分所以用patch）
router.patch('/:id', auth, checkoutOwner, update)

// 删除用户信息
router.delete('/:id', auth, checkoutOwner, del)

// 登录接口
router.post('/login', login)

// 获取关注人列表（这里的id是用户id，就是我）
router.get('/:id/following', listFollowing)

// 获取粉丝列表
router.get('/:id/followers', listFollower)

// 关注用户（这里的id是想要关注的用户的id）
router.put('/following/:id', auth, checkUserExist, follow)

// 取消关注用户
router.delete('/following/:id', auth, checkUserExist, unfollow)

// 关注话题
router.put('/followingTopics/:id', auth, checkTopicsExist, followTopic)

// 取消关注话题
router.delete('/followingTopics/:id', auth, checkTopicsExist, unfollowTopic)

// 获取用户的关注话题列表
router.get('/:id/followingTopics', listFollowingTopics)

module.exports = router