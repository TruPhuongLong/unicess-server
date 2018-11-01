import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
    },
    address: {
        type: String
    },
    phoneNumber: {
        type: String
    }
});

UserSchema.static.authenticate = function (email, cb) {
    User.findOne({email})
        .then(user => cb(null, user))
        .catch(error => cb(error))
}

const User = mongoose.model('User', UserSchema);
module.exports = { User };