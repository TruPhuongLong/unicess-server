import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import router from './routes/root-route';
import './db/mongoose';
import {initAdmin} from './lib/initAdmin';

const port = process.env.PORT || 2345;

const app = express();



//MIDDLEWARE
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

app.use(router);



//Global Error handler:
app.use(function (err, req, res, next) {
    console.log('=== app.js - global handler err ')
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(port, () => {
    console.log(`server listen on port ${port}`)
    initAdmin();
})