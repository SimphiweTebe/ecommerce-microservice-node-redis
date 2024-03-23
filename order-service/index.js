const express = require('express')
const { client, subscriber } = require('./config/redis')
const fastFoods = require('./models/orders')
const handleHeaderRequests = require('./middleware/headerRequest')

const PORT = process.env.PORT || 4000
const app = express()

app.use(express.json())
app.use((req, res, next)=> handleHeaderRequests(req, res, next))

app.post('/order', async (req, res, next)=> {
  const { name, quantity } = req.body
  
  if (!name || !quantity) res.status(404).json({ message: 'Order is missing name or quanity'})

  const orderReceipt = {
    name,
    quantity,
    totalPrice: quantity * fastFoods[name]
  }

  await client.publish('NEW_ORDER', JSON.stringify(orderReceipt))

  await subscriber.subscribe('ORDER_STATUS', (message) => {
    const currentOrder = JSON.parse(message)
    
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