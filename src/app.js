const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const DatabaseService = require('./services/Database')
const publicRouter = require('./routers/public')
const protectedRouter = require('./routers/protected')

const db = new DatabaseService()
const app = express()

const urlPrefix = '/api/v1/'

app.use(bodyParser.json())

app.use(cors())

app.use((req, res, next) => {
  req.db = db
  next()
})

app.all('/', (req, res) => res.redirect(urlPrefix))
app.use(urlPrefix, publicRouter)
app.use(urlPrefix, protectedRouter)

module.exports = app
