var through = require('through2')

module.exports = function (predicate) {
  var stream = through((chunk, enc, cb) => {
    var stripped = chunk.filter(predicate)
    stream.total += chunk.length - stripped.length
    cb(null, stripped)
  })
  stream.total = 0
  return stream
}

