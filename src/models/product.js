import mongoose from 'mongoose';

const Product = mongoose.model('Product', {
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    price: {
        type: Number,
        required: true
    },
    unitPrice: {
        type: String,
    },
    content: {
        type: String,
        trim: true,
    },
    imageUrls: [{
        type: String,
        trim: true,
    }],
    createAt: {
        type: Number
    },
    editAt: {
        type: Number
    },
    userId: {
        type: String,
        trim: true
    }
});

module.exports = {Product}