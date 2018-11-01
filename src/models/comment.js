import mongoose from 'mongoose';

const Comment = mongoose.model('Comment', {
    content: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
    },
    createat: {
        type: Number
    },
    editat: {
        type: Number
    },
    userid: {
        type: String,
        required: true,
        trim: true
    },
    productid: {
        type: String,
        required: true,
        trim: true
    }
});

module.exports = {Comment}