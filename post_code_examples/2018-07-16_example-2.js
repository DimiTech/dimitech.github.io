// Timeout race example

const processPayment = () => new Promise((resolve, reject) => {
  chargeCreditCard(() => {
    console.log('Credit card is charged $XXX')
    resolve()
  })
})

function chargeCreditCard(callback) {
  setTimeout(callback, 2 * 1000)
}

const rejectAfter = timeout => new Promise((resolve, reject) => {
  setTimeout(() => reject('Request timed out!'), timeout)
})

Promise.race([
    processPayment(),
    rejectAfter(1000)
  ])
  .then(() => {
    console.log('Payment processed')
  })
  .catch(console.error)
