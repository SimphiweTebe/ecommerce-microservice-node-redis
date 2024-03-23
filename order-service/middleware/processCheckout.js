const processCheckout = (req, res, next)=> {
  const { order } = req.body

  if(!order) {
    return res.send('No orders')
  }
  
  if(!order.name || !order.quantity){
    return res.status(404).json({ message: 'Order is missing name or quantity'})
  }

  const date = new Date()

  order.time = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'full',
    timeStyle: 'long',
  }).format(date)

  next()
}

module.exports = processCheckout