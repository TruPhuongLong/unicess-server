import {Router} from 'express';
import {userRouter} from './user-route';
import {productRouter} from './product-route';
import {orderRouter} from './oder-route';

const router = new Router();

//user router:
userRouter(router);

//product router:
productRouter(router);

//order router
orderRouter(router)


router.get('*', (req, res) => {
    res.json({message: 'not found'})
})

module.exports = router;

