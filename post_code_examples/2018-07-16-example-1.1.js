const p = fetchRawData() // Takes ~1000ms to resolve
  .then(buffer => {
    if (p.isCancelled) return Promise.reject()
    return decode(buffer)
  })
  .then(decoded => {
    if (p.isCancelled) return Promise.reject()
    return showOnScreen(decoded)
  })
  .catch(e => {
    if (p.isCancelled) {
      console.log('Cancelled!')
    }
    else {
      console.error(e)
    }
  })

setTimeout(() => {
  p.isCancelled = true
}, 500)

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
