const setPaymentStatus = (statusType, statusMessage, options)=> {
  const { currentAmount, totalPrice, time, name } = options

  const transactionData = { balance: currentAmount, totalPrice, time }
  const orderStatus = { ...transactionData, status: statusType, message: statusMessage, item: name }
  console.log(`payment ${statusType} --> ${statusMessage} --> ${time}`)
  
  return JSON.stringify(orderStatus)
}

module.exports = { setPaymentStatus }