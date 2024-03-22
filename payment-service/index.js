const express = require('express')
const NRP = require('node-redis-pubsub')

const PORT = process.env.PORT || 4001
const app = express()

app.use(express.json())

const client = new NRP({
  PORT: 6379,
  scope: 'ecommerce-service'
})

let walletFunds = 700

client.on('NEW_ORDER', (data)=> {
  const { totalPrice } = data
  const defaultProps = { balance: walletFunds, totalPrice }

  console.log(`Payment service received new order:`, data)

  if (walletFunds > totalPrice){
    walletFunds -= totalPrice
    client.emit('ORDER_STATUS', { ...defaultProps, status: 'success',message: 'The order has been placed'})
  } 
  else {
    client.emit('ORDER_STATUS',{ ...defaultProps, status: 'error', message:  'Wallet has insufficient funds' })
  }
})

app.listen(PORT, ()=> {
  console.log(`Payment service running on port ${PORT}`)
})