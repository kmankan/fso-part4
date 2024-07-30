const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const config = './utils/config'
const middleware = '/utils/middleware'
const logger = './utils/logger'
const peopleRouter = require('./controllers/queryPhonebook')

app.use('/api/persons', peopleRouter)

// mongoDB url
const url = config.MONGODB_URL

mongoose.set('strictQuery',false)

logger.info('connecting to', config.MONGODB_URL)

// Connect to MongoDB
mongoose.connect(url)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch(error => {
    logger.error('error connecting to MongoDB: ', error.message)
  })

// enable CORS
app.use(cors())
// show static content
app.use(express.static('dist'))
app.use(express.json())

app.use(middleware.requestLogger)

app.use(middleware.morganTinyWhenNotHttpPOST)

app.use(middleware.morganCustomForHttpPOST)

// Custom middleware to log request time
app.use(middleware.correctDateTimeFormat)

app.use(middleware.unknownEndpoint)

app.use(middleware.errorHandler)

module.exports = app
