const express = require('express')
const { publisher, consumer } = require('./config/redis')
const fastFoods = require('./models/orders')
const handleHeaderRequests = require('./middleware/headerRequest')

const PORT = process.env.PORT || 4000
const app = express()

app.use(express.json())
app.use((req, res, next)=> handleHeaderRequests(req, res, next))

app.post('/order', async (req, res, next)=> {
  const { name, quantity } = req.body
  
  if (!name || !quantity) res.status(404).json({ message: 'Order is missing name or quanity'})

  const receipt = {
    name,
    quantity,
    totalPrice: quantity * fastFoods[name]
  }

  await publisher.publish('NEW_ORDER', JSON.stringify(receipt))

  await consumer.subscribe('ORDER_STATUS', (message) => {
    const currentOrder = JSON.parse(message)
    console.log(`orders status: ${currentOrder.status} | ${currentOrder.message}`)
    
    if (message.status === 'order_success') {
      return res.status(201).json(currentOrder)
    } else {
      return res.status(400).json(currentOrder)
    }
  })
})

app.listen(PORT, ()=> {
  console.log(`Orders service started on port ${PORT}`)
})