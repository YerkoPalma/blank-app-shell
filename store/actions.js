function increment () {
  return { type: 'INCREMENT' }
}
function decrement () {
  return { type: 'DECREMENT' }
}
module.exports.decrement = decrement
module.exports.increment = increment
