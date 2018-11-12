import mongoose from 'mongoose';

const ProductObject = {
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
        type: String
    }],
    createAt: {
        type: Number,
        default: Date.now
    },
    editAt: {
        type: Number,
        default: Date.now
    },
    // this is userId
    postBy: {
        type: String
    }
}

const ProductSchema = new mongoose.Schema(ProductObject);

const Product = mongoose.model('Product', ProductSchema);

module.exports = { ProductObject, ProductSchema, Product }