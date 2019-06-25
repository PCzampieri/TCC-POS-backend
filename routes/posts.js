const router = require('express').Router()
const controller = require('../controllers/posts')

const auth = require('./auth')

const db = require('../db')
const jwt = require('jsonwebtoken')
const jwtSecret = '$jXCAwkge7b19ec8PC'

const { postsCheck } = require('../validators/posts')

router.get('/', controller.get({ db }))
router.get('/:id', controller.getOne({ db }))
router.get('/category/:id', controller.getByCategories({ db }))

router.use(auth.checkJWT({ jwt, jwtSecret }))
router.post('/', postsCheck, controller.create({ db }))
router.patch('/:id', postsCheck, controller.update({ db }))
router.delete('/:id', controller.remove({ db }))

module.exports = router
