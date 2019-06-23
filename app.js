const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')

const bodyParser = require('body-parser')
app.use(cors())
app.use(bodyParser.json({ extended: true }))

app.use('/files', express.static(path.resolve(__dirname, '.', 'uploads', 'resized')))

const routes = require('./routes')
app.use(routes)

module.exports = app