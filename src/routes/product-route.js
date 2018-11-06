import { Product } from '../models/product';
import { ObjectId } from 'mongodb';
import multer from 'multer';

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
}).array('files');


//ROUTE
const productRouter = router => {

    // //GET /list Products of each user
    // router.get('/api/Products/listProducts/:userid', (req, res) => {
    //     const userid = req.params.userid;
    //     Product.find({ userid })
    //         .then(Products => res.send(Products))
    //         .catch(error => res.send(error));
    // })

    // //GET /list albums of each user
    // router.get('/api/Products/listalbums/:userid', (req, res) => {
    //     const userid = req.params.userid;
    //     Product.find({ userid })
    //         .then(Products => Products.map(Product => {
    //             const { imageurls } = Product;
    //             return imageurls;
    //         }))
    //         .then(imageurlses => res.send(imageurlses))
    //         .catch(error => res.send(error));
    // })

    // //GET /detal Products 
    // router.get('/api/Products/:id', (req, res) => {
    //     const id = req.params.id;

    //     // validate id:
    //     if (!ObjectId.isValid(id)) {
    //         const err = new Error();
    //         err.status = 403;
    //         err.message = 'invalid Product id'
    //         res.send(err);
    //     }

    //     // good to go:
    //     Product.findById(id)
    //         .then(Product => res.send(Product))
    //         .catch(error => res.send(error));
    // })

    // //Product
    // router.post('/api/Products',upload , (req, res) => {
    //     const body = req.body;
    //     const newProduct = new Product({
    //         content: body.content,
    //         createat: Date.now(),
    //         userid: body.userid,
    //     })
    //     if (!ObjectId.isValid(newProduct.userid)) {
    //         const err = new Error();
    //         err.status = 403;
    //         err.message = 'invalid userid'
    //         res.send(err);
    //     }

    //     // good to go:
    //     // save album path:
    //     if(req.files && req.files.length){
    //         newProduct.imageurls = req.files.map(file => file.path);
    //     }
    //     newProduct.save()
    //         .then(Product => res.status(200).send(Product))
    //         .catch(error => res.send(error));

    // })

    // router.patch('/api/Products/:id', (req, res) => {
    //     const id = req.params.id;

    //     //validate id:
    //     if (!ObjectId.isValid(id)) {
    //         res.status(404).send();
    //     }

    //     // good to go:
    //     const body = req.body;
    //     body.editat = Date.now();
    //     Product.findByIdAndUpdate(id, { $set: body }, { new: true })
    //         .then(Product => {
    //             if (!Product) {
    //                 res.status(404).send();
    //             }
    //             res.send(Product);
    //         })
    //         .catch(error => res.status(400).send(error));
    // });

    // router.delete('/api/Products/:id', (req, res) => {
    //     const id = req.params.id;

    //     //validate id:
    //     if (!ObjectId.isValid(id)) {
    //         res.status(404).send();
    //     }

    //     // good to go:
    //     Product.findByIdAndRemove(id)
    //         .then(Product => {
    //             if (!Product) {
    //                 res.status(404).send();
    //             }
    //             res.status(200).send();
    //         })
    //         .catch(error => res.status(400).send(error));
    // });

    //GET products
    router.get('/api/products', (req, res, next) => {
        console.log('=== product - get -')
        Product.find()
            .then(products => {
                // if(!products.length) next(new Error('empty products'))
                res.send(products)
            })
            .catch(error => {
                console.log('=== router - get - products - catch')
                next(error)
            });
    })

    //POST product
    router.post('/api/product', upload, (req, res, next) => {
        console.log('=== product - post -')
        const body = req.body;
        console.log(body)
        const newProduct = new Product(body);
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