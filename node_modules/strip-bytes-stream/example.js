var sbs = require('./') 

process.stdin
  .pipe(sbs(n => n < 96 || n > 99))
  .on('end', function () {
    console.log(this.total + ' bytes removed')
  })
  .pipe(process.stdout)