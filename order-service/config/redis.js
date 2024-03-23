const redis = require('redis')

const publisher = redis.createClient({
  host: '127.0.0.1',
  port: process.env.REDIS_PORT || 6379
})

const consumer = publisher.duplicate()

const connectRedisInstance = async ()=> {
  try {
    await publisher.connect()
    await consumer.connect()
  } catch (error) {
    console.log(`Redis connection error ${error.message}`)
  }
}

connectRedisInstance()

module.exports = { publisher, consumer }