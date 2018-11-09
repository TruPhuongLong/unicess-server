import multer from 'multer';

import {UPLOAD_FILE_KEY} from './contance';

//Setup for save image:
const storage = multer.diskStorage({
    // destination to save file:
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    // set name of file:
    filename: function (req, file, cb) {
        console.log('file get: ', file)
        cb(null, Date.now() + file.originalname);
    }
});

// filter type: jpeg, jpg, png
const fileFilter = (req, file, cb) => {
    console.log('fileFilter', file);
    if (file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        err = new Error();
        err.status = 401;
        err.message = 'file accept: image with suffix /jpg, /png, /jpeg';
        cb(err, false);
    }
}

// let all together in here:
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2000 * 2000 * 5
    },
    fileFilter: fileFilter
}).array(UPLOAD_FILE_KEY);

module.exports = {upload}