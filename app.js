const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')

const bodyParser = require('body-parser')
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())

app.use('/files', express.static(path.resolve(__dirname, '.', 'uploads', 'resized')))

const routes = require('./routes')
app.use(routes)

module.exports = app