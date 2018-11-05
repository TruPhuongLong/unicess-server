import mongoose from 'mongoose';
import { User } from './user';

const OrderSchema = new mongoose.Schema({
    listOrder: [
        {
            productId: {
                type: String,
                trim: true,
            },
            quantity: {
                type: Number,
                trim: true,
                minlength: 1,
            }
        }
    ],
    userEmail: {
        type: String,
        trim: true
    },
    priceShip: {
        type: Number
    },
    priceTotal: {
        type: Number
    },
    createAt: {
        type: Number
    }
});

//save user infomation before save order
OrderSchema.static('saveUser', function (user, cb) {
    console.log(user)
    User.findOne({ email: user.email })
        .then(_user => {
            console.log(_user)
            if(!_user){
                createNewUser(user);
            }else{
                cb(null)
            }
        }) // user already exists: so not need to save
        .catch(error => {
            // save this user
            createNewUser(user);
        })

    function createNewUser(user) {
        console.log('create new user from post Order')
        const newUser = new User(user);
        newUser.save()
            .then(_ => cb(null))
            .catch(error => cb(error))
    }
})

const Order = mongoose.model('Order', OrderSchema);
module.exports = { Order }