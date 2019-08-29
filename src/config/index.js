require('dotenv').config()

const { PORT } = process.env

module.exports = {
  PORT: PORT || 5000,
}
