// http://bluebirdjs.com/docs/api/cancellation.html

const Promise = require('bluebird')

Promise.config({
  cancellation: true
})

const p = fetchRawData() // Takes ~1000ms to resolve
  .then(buffer => decode(buffer))
  .then(decoded => showOnScreen(decoded))
  .catch(console.error)
  .finally(() => {
    if (p.isCancelled) {
      console.log('Cancelled!')
    }
  })

setTimeout(() => p.cancel(), 500)

function fetchRawData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve([0x00, 0x01]), 1000)
  })
}
function decode(buffer) {
  return new Promise((resolve, reject) => {
    resolve(buffer.map(item => 'abcdefg'.charAt(item)))
  })
}
function showOnScreen(decoded) {
  return new Promise((resolve, reject) => {
    resolve(console.log(decoded))
  })
}
