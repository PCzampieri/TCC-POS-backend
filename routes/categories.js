const router = require('express').Router()
const controller = require('../controllers/categories')

const auth = require('./auth')

const db = require('../db')
const jwt = require('jsonwebtoken')
const jwtSecret = '$jXCAwkge7b19ec8PC'

const { categoryCheck } = require('../validators/categories')

router.get('/', controller.get({ db }))
router.get('/:id', controller.getOne({ db }))

router.use(auth.checkJWT({ jwt, jwtSecret }))
router.post('/', categoryCheck, controller.create({ db }))
router.patch('/:id', categoryCheck, controller.update({ db }))
router.delete('/:id', controller.remove({ db }))

module.exports = router
