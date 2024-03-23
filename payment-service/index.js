const express = require('express')
const { client, subscriber } = require('./config/redis')

const PORT = process.env.PORT || 4001
const app = express()

app.use(express.json())

async function processOrders(){
  let walletFunds = 700

  await subscriber.subscribe('NEW_ORDER', (message) => {
    const currentOrder = JSON.parse(message)
    const { totalPrice } = currentOrder
    const transactionData = { balance: walletFunds, totalPrice }

    const setOrderStatus = (status, message)=> {
      const orderStatus = { ...transactionData, status, message}
      console.log(`status: ${status}, message: ${message}`)
      return JSON.stringify(orderStatus)
    }

    if (walletFunds > totalPrice){
      walletFunds = walletFunds - totalPrice
      client.publish('ORDER_STATUS', setOrderStatus('success', 'The order has been placed'))
    } 
    else {
      client.publish('ORDER_STATUS', setOrderStatus('error', 'Wallet has insufficient funds'))
    }
     
  })
}

processOrders()

app.listen(PORT, ()=> {
  console.log(`Payment service running on port ${PORT}`)
})