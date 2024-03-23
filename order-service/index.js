const express = require('express')
const { publisher, consumer } = require('./config/redis')
const fastFoods = require('./models/orders')
const handleRequests = require('./middleware/handleRequests')
const processCheckout = require('./middleware/processCheckout')

const PORT = process.env.PORT || 4000
const app = express()

app.use(express.json())
app.use('/order', handleRequests)

app.post('/order', processCheckout, async (req, res, next)=> {
  const { name, quantity, time } = req.body.order

  const receipt = {
    item: name,
    quantity,
    totalPrice: quantity * fastFoods[name],
    time
  }

  await publisher.publish('NEW_ORDER', JSON.stringify(receipt))

  await consumer.subscribe('ORDER_STATUS', (message) => {
    const currentOrder = JSON.parse(message)
    console.log(`order ${currentOrder.status} | ${currentOrder.time}`)
    
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