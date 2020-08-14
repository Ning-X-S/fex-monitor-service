const path = require('path')
const { version } = require('../../package.json')

const { init } = require('node-logger')
const logger = init({ version, filename: path.resolve(__dirname, '../../log/out-%DATE%.log'), datePattern: 'YYYY-MM-DD-HH' })

if (process.env.NODE_ENV === 'dev') {
  module.exports = {
    log: console
  }
} else {
  module.exports = {
    log: logger
  }
}
