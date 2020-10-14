const Router = require('koa-router')
const router = new Router({prefix: '/topics'})
const { find, findById, create, update, checkTopicsExist, topicListFollower, questionListFollower } = require('../controllers/topic')
// const jwt = require('jsonwebtoken')
const { secret } = require('../config')
const jwt = require('koa-jwt')

const auth = jwt({ secret })

router.get('/', find)
router.post('/', auth, create)
router.get('/:id', checkTopicsExist, findById)
router.patch('/:id', auth, checkTopicsExist, update)
router.get('/:id/followers', checkTopicsExist, topicListFollower)
router.get('/:id/questions', checkTopicsExist, questionListFollower)

module.exports = router