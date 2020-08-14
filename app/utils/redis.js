const Redis = require('ioredis')
const ServiceError = require('./error')
const { redisClientError } = require('./error-list')
const config = require('../../config').redis

let redis = null
if (process.env.NODE_ENV === 'dev') {
  redis = new Redis(config)
} else {
  redis = new Redis.Cluster(config)
}

redis.on('error', (err) => {
  console.log(err)
  throw new ServiceError(redisClientError)
})

module.exports = redis
