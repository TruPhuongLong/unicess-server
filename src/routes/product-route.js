import { checkAuth, checkAdmin } from '../lib/middlewares/auth.middleware';
import {upload} from '../lib/upload';
import ProductControler from '../controlers/product-controler';

//ROUTE
const productRouter = router => {

    //GET products /test ok.
    router.get('/api/products',  ProductControler.gets);

    //POST product / test ok.
    // router.post('/api/product', checkAuth, checkAdmin, upload, ProductControler.post);

    //only test
    router.post('/api/product', upload, ProductControler.post);

}

module.exports = { productRouter }