const express = require('express')
const { publisher, consumer } = require('./config/redis')

const PORT = process.env.PORT || 4001
const app = express()

app.use(express.json())

async function processPayment(){
  let walletFunds = 700

  await consumer.subscribe('NEW_ORDER', (message) => {
    const currentOrder = JSON.parse(message)
    const { totalPrice, time, item } = currentOrder
    const transactionData = { balance: walletFunds, totalPrice, time }

    const setOrderStatus = (status, message)=> {
      const orderStatus = { ...transactionData, status, message, item }
      console.log(`${status} | ${message} | ${time}`)
      return JSON.stringify(orderStatus)
    }

    if (walletFunds >= totalPrice){
      walletFunds = walletFunds - totalPrice
      publisher.publish('ORDER_STATUS', setOrderStatus('success', 'Payment processed'))
    } 
    else {
      publisher.publish('ORDER_STATUS', setOrderStatus('error', 'Insufficient funds'))
    }
     
  })
}

processPayment()

app.listen(PORT, ()=> {
  console.log(`Payment service running on port ${PORT}`)
})