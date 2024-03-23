const date = new Date()

const setNewTimeStamp = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'full',
  timeStyle: 'long',
}).format(date)

module.exports = { setNewTimeStamp }