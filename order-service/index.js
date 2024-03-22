const express = require('express')
const redis = require('node-redis-pubsub')
const handleHeaderRequests = require('./middleware/headerRequest')

const PORT = process.env.PORT || 4000
const app = express()

app.use(express.json())

app.use((req, res, next)=> handleHeaderRequests(req, res, next));

const client = new redis({
  PORT: 6379,
  scope: 'ecommerce-service'
})

const foodModel = {
  burger: 120,
  sausageRoll: 30,
  chicken: 70
}

app.post('/order', (req, res, next)=> {
  const { name, quantity } = req.body
  
  if (!name || !quantity) {
    return res.status(404).json({
      message: 'Order is missing name or quanity'
    })
  }

  const orderReceipt = {
    name: name,
    quantity: quantity,
    totalPrice: quantity * foodModel[name]
  }

  client.emit('NEW_ORDER', orderReceipt)

  client.on('ORDER_STATUS', (message)=> {
    console.log(`Order service received status for order - ${name}:`, message)

    if (message.status === 'order_success') {
      return res.status(201).json(message)
    } else {
      return res.status(400).json(message)
    }
  })
})

app.listen(PORT, ()=> {
  console.log(`Order service running on port ${PORT}`)
})