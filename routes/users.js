const router = require('express').Router()
const controller = require('../controllers/users')

const auth = require('./auth')

const db = require('../db')
const jwt = require('jsonwebtoken')
const jwtSecret = '$jXCAwkge7b19ec8PC'

const { userCheck } = require('../validators/users')
const { loginCheck } = require('../validators/login')

router.post('/login', loginCheck, controller.login({ db, jwt, jwtSecret }))
router.post('/', auth.injectUserFromToken({ jwt, jwtSecret }), userCheck, controller.create({ db }))

router.use(auth.checkJWT({ jwt, jwtSecret }))
router.get('/', controller.get({ db }))
router.get('/me', controller.getMe({ db }))
router.patch('/:id', userCheck, controller.update({ db }))
router.get('/:id', controller.getOne({ db }))
router.delete('/:id', controller.remove({ db }))

module.exports = router


