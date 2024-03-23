/*
This middleware helps resolve an issue: Error: Can't set headers after they are sent to the client.

This happens when response was delivered to client and again you are trying to give response. You have to check in your code that somewhere you are returning response to client again which causes this error. Check and return response once when you want to return. - Solution by Ankit Manchanda on stackoverflow
 */

function handleRequests (req,res,next) {
  const _send = res.send
  let sent = false

  res.send = function(data){
    if(sent) return
    _send.bind(res)(data)
    sent = true
  }

  next()
}

module.exports = handleRequests