const { StringDecoder } = require('string_decoder')
const decoder = new StringDecoder('utf8')

const cent = Buffer.from([0xC2, 0xA2])
console.log(cent.toString())
console.log(cent.toString() === decoder.write(cent))

const euro = Buffer.from([0xE2, 0x82, 0xAC])
console.log(euro.toString())
console.log(euro.toString() === decoder.write(euro))
