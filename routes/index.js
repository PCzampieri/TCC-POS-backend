const multer = require('multer')
const uploadConfig = require('../config/upload')
const router = require('express').Router()
const upload = multer(uploadConfig)

const users = require('./users')
const posts = require('./posts')
const categories = require('./categories')
const comments = require('./comments')

router.get('/', (req, res) => res.send('Blog TCC: Cezar e Bruno.'))
router.use('/users', users)
router.use('/posts', upload.single('image_url'), posts)
router.use('/categories', categories)
router.use('/comments', comments)

module.exports = router