import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';

import { ROLES } from '../lib/contance';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    // name: {
    //     type: String,
    // },
    password: {
        type: String,
    },
    address: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    role: {
        type: String
    },
    createAt: {
        type: Number,
        default: Date.now()
    },
    editAt: {
        type: Number,
        default: Date.now()
    }
});

//encrypt password
function bcryptPassword(user, next) {
    if (!user.password) next();
    console.log(`=== encrypt admin password`)
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
            console.log(`=== UserSchema.pre save have error when encrupt password`)
            return next(err)
        }
        console.log(`password after bcrypt is: ${hash}`)
        user.password = hash;
        next();
    })
}

// encode password for secret before save to database:
UserSchema.pre('save', function (next) {
    const user = this;
    bcryptPassword(user, next);
})

// UserSchema.pre('findByIdAndUpdate', function (next) {
//     const user = this;
//     bcryptPassword(user, next);
// })

//auth regular user: only email
UserSchema.statics.authenticateOnlyEmail = function (user, cb) {
    console.log('=== authenticateOnlyEmail')
    User.findOne({ email: user.email })
        .then(user => {
            console.log(`=== authenticateOnlyEmail, user ${user}`)
            return cb(null, user)
        })
        .catch(error => {
            console.log(`=== authenticateOnlyEmail error ${error}`)
            cb(error)
        })
}


//authenticate input against database: this func will be call when login
// UserSchema.statics
UserSchema.statics.authenticate = function (userInput, callback) {
    User.findOne({ email: userInput.email })
        .exec(function (err, user) {
            if (err) {
                console.log(`=== authenticate, err check email`)
                return callback(err)
            } else if (!user) {
                const err = new Error();
                err.status = 401;
                err.message = 'email incorrect';
                console.log(`=== authenticate, err incorrect email`)
                return callback(err);
            }

            // correct email then check password:
            bcrypt.compare(userInput.password, user.password, function (err, result) {
                if (err) {
                    console.log(`=== authenticate, err compare password`)
                    return callback(err);
                }
                if (result !== true) {
                    const err = new Error();
                    err.status = 401;
                    err.message = 'password incorrect';
                    console.log(`=== authenticate, err incorrect password`)
                    return callback(err);
                }
                // if(userInput.role !== ROLES.admin){
                //     const err = new Error('not admin');
                //     console.log(`=== authenticate, err not admin`)
                //     return callback(err);
                // }
                console.log(`=== authenticate user is: ${JSON.stringify(user)}`)
                return callback(null, user);
            })
        });
}


const User = mongoose.model('User', UserSchema);
module.exports = { User };