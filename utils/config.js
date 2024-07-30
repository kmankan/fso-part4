require('dotenv').config()


const PORT = process.env.PORT
const password = encodeURIComponent(process.env.MONGODB_PASSWORD)
const MONGODB_URI = process.env.MONGODB_URL.replace('<password>', password)

module.exports = {
  MONGODB_URI,
  PORT
}

