const express = require('express')
const client = require('./config/redis')
const handleHeaderRequests = require('./middleware/headerRequest')
const fastFoods = require('./models/orders')

const PORT = process.env.PORT || 4000
const app = express()

app.use(express.json())

app.use((req, res, next)=> handleHeaderRequests(req, res, next));

app.post('/order', async (req, res, next)=> {
  const { name, quantity } = req.body
  
  if (!name || !quantity) {
    return res.status(404).json({
      message: 'Order is missing name or quanity'
    })
  }

  const orderReceipt = {
    name: name,
    quantity: quantity,
    totalPrice: quantity * fastFoods[name]
  }

  await client.publish('NEW_ORDER', JSON.stringify(orderReceipt))

  res.send('Order sent')

  // client.on('ORDER_STATUS', (message)=> {
  //   console.log(`Order service received status for order - ${name}:`, message)

  //   if (message.status === 'order_success') {
  //     return res.status(201).json(message)
  //   } else {
  //     return res.status(400).json(message)
  //   }
  // })
})

app.listen(PORT, ()=> {
  console.log(`Orders service started on port ${PORT}`)
})