const router = require('express').Router()

const users = require('./users')
const posts = require('./posts')
const categories = require('./categories')
const comments = require('./comments')

router.get('/', (req, res) => res.send('Blog TCC: Cezar e Bruno.'))
router.use('/users', users)
router.use('/posts', posts)
router.use('/categories', categories)
router.use('/comments', comments)

module.exports = router