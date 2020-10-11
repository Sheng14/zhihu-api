const Router = require('koa-router')
const router = new Router({prefix: '/topics'})
const { find, findById, create, update } = require('../controllers/topic')
// const jwt = require('jsonwebtoken')
const { secret } = require('../config')
const jwt = require('koa-jwt')

const auth = jwt({ secret })

router.get('/', find)
router.post('/', auth, create)
router.get('/:id', findById)
router.patch('/:id', auth, update)

module.exports = router