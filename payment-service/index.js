const express = require('express')
const { publisher, consumer } = require('./config/redis')

const PORT = process.env.PORT || 4001
const app = express()

app.use(express.json())

async function processPayment(){
  let walletFunds = 700

  await consumer.subscribe('NEW_ORDER', (message) => {
    const currentOrder = JSON.parse(message)
    const { totalPrice } = currentOrder
    const transactionData = { balance: walletFunds, totalPrice }

    const setOrderStatus = (status, message)=> {
      const orderStatus = { ...transactionData, status, message}
      console.log(`payment status: ${status} | ${message}`)
      return JSON.stringify(orderStatus)
    }

    if (walletFunds >= totalPrice){
      walletFunds = walletFunds - totalPrice
      publisher.publish('ORDER_STATUS', setOrderStatus('success', 'The order has been placed'))
    } 
    else {
      publisher.publish('ORDER_STATUS', setOrderStatus('error', 'Wallet has insufficient funds'))
    }
     
  })
}

processPayment()

app.listen(PORT, ()=> {
  console.log(`Payment service running on port ${PORT}`)
})