const { setNewTimeStamp } = require("../utilities/dateUtility")

const processCheckout = (req, res, next)=> {
  const { order } = req.body

  if(!order) {
    return res.send('No orders')
  }
  
  if(!order.name || !order.quantity){
    return res.status(404).json({ message: 'Order is missing name or quantity'})
  }

  console.log(order.time)

  if(!order.time) {
    order.time = setNewTimeStamp()
  }

  console.log(order.time)

  next()
}

module.exports = processCheckout