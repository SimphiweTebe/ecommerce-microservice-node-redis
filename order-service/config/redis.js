const redis = require('redis')

const REDIS_PORT = process.env.REDIS_PORT || 6379

const client = redis.createClient({
  host: '127.0.0.1',
  port: REDIS_PORT
})

const subscriber = client.duplicate()

const connectRedisInstance = async ()=> {
  try {
    await client.connect()
    await subscriber.connect()
  } catch (error) {
    console.log(`Redis connection error ${error.message}`)
  }
}

connectRedisInstance()

module.exports = { client, subscriber }