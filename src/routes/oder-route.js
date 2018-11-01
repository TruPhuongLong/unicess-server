import { Order } from '../models/order';

const orderRouter = router => {
    //GET
    router.get('api/orders/:userId', (req, res, next) => {

    })

    //POST
    router.post('/api/order', (req, res, next) => {
        console.log('=== router - order - post')
        const body = req.body;
        const user = { email: body.email, name: body.userName, address: body.address, phoneNumber: body.phoneNumber }

        // console.log(user)

        // check user:
        Order.saveUser(user, (error) => {
            if (!error) {
                //complete save new user if is new, good to save newOrder
                const newOrder = new Order(body);
                newOrder.save()
                    .then(_ => res.status(200).send())
                    .catch(error => res.send(error))
            }else {
                res.send(error)
            }
        })
    })
}

module.exports = { orderRouter }