# strip-bytes-stream

strip bytes from a stream according to a predicate

## Usage

```js
require('strip-bytes-stream') => (predicate) => stream
```

### `stream.total`

Holds a running total of removed bytes, see example for use case.

## Example

Strip bytes with values between 96 and 99 inclusive (remove a, b, c and chars)

```js
var sbs = require('strip-bytes-stream') 

process.stdin
  .pipe(sbs(n => n < 96 || n > 99))
  .on('end', function () {
    console.log(this.total + ' bytes removed')
  })
  .pipe(process.stdout)
```

```sh
echo "abcdef" | node example.js
def
3 bytes removed
```

## Support

Node v4+

## License

MIT

## Acknowledgements

* Sponsored by nearForm