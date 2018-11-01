import mongoose from 'mongoose';

mongoose.PromiseProvider = global.Promise;
mongoose.connect('mongodb://localhost:27017/UnicessServer')
.then(()=>console.log('connected to mongodb server'))
.catch(error => console.log('unable to connect mongodb server. ', error))

module.exports = {mongoose};