const router = require('express').Router()
const controller = require('../controllers/comments')

const db = require('../db')

router.get('/post/:id', controller.getByPost({ db }))
router.get('/:id', controller.getOne({ db }))
router.post('/', controller.create({ db }))
router.patch('/:id', controller.update({ db }))
router.delete('/:id', controller.remove({ db }))

module.exports = router
