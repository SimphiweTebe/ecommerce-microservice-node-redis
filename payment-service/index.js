const express = require('express')
const { publisher, consumer } = require('./config/redis')

const PORT = process.env.PORT || 4001
const app = express()

app.use(express.json())

async function processPayment(){
  let currentAmount = 700

  await consumer.subscribe('NEW_ORDER', (message) => {
    const currentOrder = JSON.parse(message)
    const { totalPrice, time, item } = currentOrder
    const isSuffiecientAmount = currentAmount >= totalPrice
    const transactionAmount = currentAmount - totalPrice
    
    const setOrderStatus = (status, message)=> {
      const transactionData = { balance: currentAmount, totalPrice, time }
      const orderStatus = { ...transactionData, status, message, item }
      console.log(`${status} | ${message} | ${time}`)
      return JSON.stringify(orderStatus)
    }

    if (isSuffiecientAmount){
      currentAmount = transactionAmount
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