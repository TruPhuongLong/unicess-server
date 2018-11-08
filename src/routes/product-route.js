import { ObjectId } from 'mongodb';
import multer from 'multer';

import { Product } from '../models/product';
import { checkAuth, checkAdmin } from '../lib/middlewares/auth.middleware';
import {UPLOAD_FILE_KEY} from '../lib/contance';

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


//ROUTE
const productRouter = router => {

    //GET products
    router.get('/api/products', (req, res, next) => {
        console.log('=== product - get -')
        Product.find()
            .then(products => {
                if (products.length <= 0) {
                    const err = new Error('products is empty')
                    res.send(err)
                } else {
                    res.send(products)
                }
            })
            .catch(error => {
                console.log('=== router - get - products - catch')
                next(error)
            });
    })

    //POST product
    router.post('/api/product', checkAuth, checkAdmin, upload, (req, res, next) => {
        console.log('=== product - post -')
        const { product } = req.body;
        console.log(product)
        const newProduct = new Product(product);
        newProduct.createAt = Date.now();

        // save album path:
        if (req.files && req.files.length) {
            newProduct.imageUrls = req.files.map(file => file.path);
        }

        newProduct.save()
            .then(() => res.status(200).send())
            .catch(error => next(error))
    })


}

module.exports = { productRouter }