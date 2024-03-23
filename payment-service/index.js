const { publisher, consumer } = require('./config/redis')
const { setPaymentStatus } = require('./helpers/paymentHelpers')

async function paymentProcessing(){
  let currentAmount = 800

  await consumer.subscribe('NEW_ORDER', (message) => {
    const currentOrder = JSON.parse(message)
    const { totalPrice, time, item } = currentOrder
    const isSufficientAmount = currentAmount >= totalPrice
    const transactionAmount = currentAmount - totalPrice

    const statusOptions = {
      name: item,
      time,
      totalPrice,
      currentAmount
    }

    if (!isSufficientAmount) {
      publisher.publish('ORDER_STATUS', setPaymentStatus('error', 'Payment declined', statusOptions))
      return
    } 

    currentAmount = transactionAmount
    publisher.publish('ORDER_STATUS', setPaymentStatus('success', 'Payment processed', statusOptions))
  })
}

paymentProcessing()