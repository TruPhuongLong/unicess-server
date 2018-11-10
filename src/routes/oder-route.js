import { Order } from '../models/order';
import { User } from '../models/user';
import { transporter, mailOptionsDefault } from '../services/mail.service';

const orderRouter = router => {
    //GET
    router.get('api/orders/:userEmail', (req, res, next) => {
        const userEmail = req.params.userEmail;
        User.authenticateOnlyEmail({email: userEmail}, (err, user) => {
            if (err) {
                res.status(404).send(err);
            }
            if (!user) {
                res.status(404).send();
            }
            //find order depend on userEmail:
            Order.find({ userEmail })
                .sort({ createAt: -1 })
                .then(orders => res.send(orders))
                .catch(error => res.send(error))
        })
    })

    //POST
    router.post('/api/order', (req, res, next) => {
        console.log('=== router - order - post')

        const body = req.body;
        console.log(body)
        console.log('test')
        const user = body.user;

        // console.log(user)

        // check user:
        Order.saveUser(user, (error) => {
            if (!error) {
                //complete save new user if is new, good to save newOrder
                const { listOrder, priceShip, priceTotal } = body;
                const order = { listOrder, priceShip, priceTotal, userEmail: user.email, createAt: Date.now() };
                const newOrder = new Order(order);
                newOrder.save()
                    .then(_ => res.status(200).send())
                    .catch(error => res.send(error))
            } else {
                res.send(error)
            }
        })


        transporter.sendMail(mailOptionsDefault, function (err, info) {
            if (err)
                console.log(err)
            else
                console.log(info);
        });
    })
}

module.exports = { orderRouter }