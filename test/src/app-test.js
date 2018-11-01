// import {test} from 'tap';

// test('first test fun', (assert) => {
//     assert.is(1, 1, "1 alway equal 1");
//     assert.end();
// })



// import encode from 'base64-encode-stream';

// process.stdin.on('data', data => {
//     console.log(data.toString());
//     process.stdout.write(data.toString('base64') + '\n')
// })

// process.stdin.pipe(encode()).pipe(process.stdout)







// import fs from 'fs';
// import path from 'path';

// const cwd = process.cwd();
// console.log(cwd)
// const bytes = fs.readFileSync(path.join(cwd, 'text.txt'));

// const clean = bytes.filter(n => n);
// fs.writeFileSync(path.join(cwd, 'clean.dat'), clean);

// fs.appendFileSync(path.join(cwd, 'log.txt'), (new Date) + '	' + (bytes.length - clean.length) + '	bytes	removed\n')	











// setInterval(() => process.stdout.write('.'), 10).unref()

// const fs = require('fs')
// const path = require('path')
// const cwd = process.cwd()
// const sbs = require('strip-bytes-stream');
// const tableaux = require('tableaux');

// fs.readFile(path.join(cwd, 'file.dat'), (err, bytes) => {
//     if (err) { console.error(err); process.exit(1); }
//     const clean = bytes.filter(n => n)
//     fs.writeFile(path.join(cwd, 'clean.dat'), clean, (err) => {
//         if (err) {
//             console.error(err); 
//             process.exit(1);
//         }
//         fs.appendFile(path.join(cwd, 'log.txt'), (new Date) + '	' + (bytes.length - clean.length) + '	bytes removed\n')
//     })
// })

// fs.createReadStream(path.join(cwd, 'file.dat'))
//     .pipe(sbs(n => n))
//     .on('end', function () {log(this.total)})
//     .pipe(fs.createWriteStream(path.join(cwd, 'clean.dat')))


// function log(total) {
//     fs.appendFile(path.join(cwd, 'log.txt'), (new Date) + '  ' + total + ' bytes removed \n')
// }
















// const fs = require('fs')
// const path = require('path')
// const tableaux = require('tableaux')

// const write = tableaux(
//     { name: 'Name', size: 20 },
//     { name: 'Created', size: 30 },
//     { name: 'DeviceId', size: 10 },
//     { name: 'Mode', size: 8 },
//     { name: 'Lnks', size: 4 },
//     { name: 'Size', size: 6 }
// )


// function print(dir) {
//     fs.readdirSync(dir).
//         map((file) => ({ file, dir })).
//         map(toMeta).
//         forEach(output)
//     write.newline()
// }

// function toMeta({ file, dir }) {
//     const stats = fs.statSync(path.join(dir, file))
//     var { birthtime, ino, mode, nlink, size } = stats
//     birthtime = birthtime.toUTCString()
//     mode = mode.toString(8)
//     size += 'B'
//     return { file, dir, info: [birthtime, ino, mode, nlink, size], isDir: stats.isDirectory() }
// }

// function output({ file, dir, info, isDir }) {
//     write(file, ...info)
//     if (!isDir) { return } 
//     const p = path.join(dir, file)
//     write.arrow()
//     fs.readdirSync(p).forEach((f) => {
//         const stats = fs.statSync(path.join(p, f))
//         const style = stats.isDirectory() ? 'bold' : 'dim'
//         write[style](f)
//     })
//     write.newline()
// }

// print(process.argv[2] || '.')	


















// const fs = require('fs')
// const { execSync } = require('child_process')

// const file = process.argv[2]
// if (!file) {
//     console.error('specify	a	file')
//     process.exit(1)
// } try {
//     fs.accessSync(file)
//     console.error('file	already	exists')
//     process.exit(1)
// } catch (e) {
//     makeIt()
// }

// function makeIt() {
//     const nobody = Number(execSync('id -u nobody').toString().trim())
//     console.log(nobody)
//     fs.writeFileSync(file, '')
//     fs.chownSync(file, nobody, nobody)
//     fs.chmodSync(file, 0)
//     console.log(file + '	created')
// }








// const chokidar = require('chokidar')
// const human = require('human-time')
// const watcher = chokidar.watch(process.argv[2] || '.', { alwaysStat: true })

// watcher.on('ready', () => {
//     watcher
//         .on('add', (file, stat) => {
//             console.log(`${file}	
//         created	${human((stat.birthtime))}`)
//         })
//         .on('unlink', (file) => {
//             console.log(`${file}	removed`)
//         })
//         .on('change', (file, stat) => {
//             const msg = (+stat.ctime === +stat.mtime) ? 'updated' : 'modified'
//             console.log(`${file}	${msg}	${human((stat.ctime))}`)
//         })
//         .on('addDir', (dir, stat) => {
//             console.log(`${dir}	folder	created	${human((stat.birthtime))}`)
//         })
//         .on('unlinkDir', (dir) => {
//             console.log(`${dir}	folder	removed`)
//         })
// })	







// console.log(__filename)
// const fs = require('fs');
// const rs = fs.createReadStream(__filename);
// rs.on('data', data => console.log('chunk data =======' + data.toString()))
// rs.on('end', () => console.log('no more data'))


// const rs = fs.createReadStream('/dev/urandom')
// var size = 0

// rs.on('data', (data) => {
//     size += data.length
//     console.log('File	size:', size)
// })	








// const fs = require('fs')
// const rs = fs.createReadStream(__filename)

// rs.on('readable', () => {
//     var data = rs.read()
//     while (data !== null) {
//         console.log('Read	chunk:', data)
//         data = rs.read()
//     }
// })

// rs.on('end', () => { console.log('No	more	data') })











// const zlib = require('zlib')	
// const map = require('tar-map-stream')	