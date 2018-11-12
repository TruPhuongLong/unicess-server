import { Product } from '../models/product';
import {queryWithExactKey, queryWithRange, pagination,} from '../services/query.service';
import {productQuery} from './product-query';

//GET list / test ok
// alow query via: name, price, price_min, price_max, createAt, createAt_min, createAt_max 
const gets = (req, res, next) => {
    // console.log(`product controler get`)

    const query = productQuery(req.query)
    // console.log(query)

    const {skip, limit} = pagination(req.query);
    
    Product.find(query)
        .sort({createAt: 'descending'})
        .skip(skip)
        .limit(limit)
        .then(products => {
            res.send(products)
        })
        .catch(error => {
            res.send(error)
        })
}

const get = (req, res, next) => {

}

//POST /test ok
const post = (req, res) => {
    console.log(`product controler post`)
    console.log(req.body)
    const product = req.body;

    const newProduct = new Product(product);

    console.log(newProduct)

    // save album path:
    if (req.files && req.files.length) {
        newProduct.imageUrls = req.files.map(file => file.path);
    }

    newProduct.save()
        .then(() => {
            console.log(`product save success`)
            res.status(200).send()
        })
        .catch(error => res.send(error))
}

module.exports = {
    gets,
    post
}


// router.get('/api/products', (req, res, next) => {
       
        // console.log('=== products - get -')

        // console.log(req.query)

        // Product.find()
        //     .then(products => {
        //         if (!products || products.length <= 0) {
        //             const err = new Error('products is empty')
        //             res.send(err)
        //         } else {
        //             res.send(products)
        //         }
        //     })
        //     .catch(error => {
        //         console.log('=== router - get - products - catch')
        //         res.status(404).send(error);
        //     });
    // })
