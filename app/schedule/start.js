const { start } = require('./sync-info')

const initType = process.argv.slice([2])[0] || 'error'

start(initType)
