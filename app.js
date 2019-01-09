const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/product.route');
const orderRoutes = require('./api/routes/order.route');
const userRoutes = require('./api/routes/user.route');
//connect mongoose 
mongoose.connect('mongodb+srv://admin:admin@cluster0-igxuv.mongodb.net/test?retryWrites=true',
        {
          useNewUrlParser:true  
        })
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use('/uploads', express.static('uploads'))

// app.use((req, res, next) =>{
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header(
//         "Access-Control-Allow-Headers",
//         "Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"
//     );
//     if(req.method === 'OPTIONS'){
//         res.header('Access-Control-Allow-Methods', 'PUT', 'PATCH', 'DELETE', "POST", 'GET');
//         return res.status(200).json({})
//     }
// })
//handing request
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);

app.use((req, res, next)=>{
    const err = new Error('Not Found');
    err.status = '404';
    next(err);
})

app.use((error, req, res, next) =>{
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message 
        }
    })
})

module.exports = app;