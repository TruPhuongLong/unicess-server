import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';

import { ROLES } from '../lib/role.contance';

const UserObject = {
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
        default: Date.now
    },
    editAt: {
        type: Number,
        default: Date.now
    }
}

const UserSchema = new mongoose.Schema(UserObject);

//encrypt password
function bcryptPassword(user, next) {
    if (!user.password) next();
    console.log(`=== encrypt password`)
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


//authenticate input against database: this func will be call when login
// UserSchema.statics
UserSchema.statics.authenticate = (role) => (userInput, callback) => {
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

            //if is regular user, then not need check password
            if (role === 'regular') {
                console.log(`=== authenticate regular user is: ${JSON.stringify(user)}`)
                return callback(null, user);
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

                console.log(`=== authenticate admin is: ${JSON.stringify(user)}`)
                return callback(null, user);
            })
        });
}


const User = mongoose.model('User', UserSchema);
module.exports = { UserObject, UserSchema, User };