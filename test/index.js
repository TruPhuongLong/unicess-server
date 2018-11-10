import fs from 'fs';
import path from 'path';

// console.log('index test')
const src = path.join(__dirname, '../src');

const fileTest = process.argv[2];

let fileExists = false;

// run file test name: fileTest
const testFileSync = (src, fileTest) => {
    if (fileExists) return;
    try {
        const files = fs.readdirSync(src);
        files && files.forEach(file => {
            testFileSync(path.join(src, file), fileTest)
        })
    } catch (error) {
        if (src.endsWith(fileTest)) {
            fileExists = true;
            require(src)
        }
    }
}

// run all file end with test.js
const testAll = (src) => {
    fs.readdir(src, (err, files) => {
        if (err) {
            if (src.endsWith('test.js')) {
                require(src)
            }
        } else {
            files && files.forEach(file => {
                testAll(path.join(src, file))
            })
        }
    })
}

if (fileTest) {
    // run only fileTest
    testFileSync(src, fileTest);
    if (!fileExists) console.log(`file name ${fileTest} not exists`)
} else {
    // run all file with sufix test.js
    testAll(src);
}