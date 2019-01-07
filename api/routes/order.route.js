const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order.model');
const Product = require('../models/product.model');

router.get('/', (req, res, next) => {
    Order.find()
    .select('product quantity')
    .populate('product' ,'name price')
    .exec()
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        res.status(404).json('Not found');
    })

})

router.post('/', (req, res, next) => {
    Product.findById(req.body.productID)
    .exec()
    .then(product => {
        const order = new Order({
            _id : mongoose.Types.ObjectId(),
            product : req.body.productID,
            quantity : req.body.quantity
        });
        return order.save()
    })
    .then(result => {
        res.status(200).json({
            message: "create order successfully",
            result : result
        });
    })
    .catch(err => {
        res.status(500).json({
            message : "Product not found",
            error : err
        })
    })
    
})

router.get('/:orderID' ,(req, res, next)=>{
    const id = req.params.orderID;
    if(id === 'special'){
        res.status(200).json({
            message : "show info the single product",
            id : id
        });
    }else{
        res.status(200).json({
            message : "Can not found",
        });
    }
})

// router.patch('/:orderID' ,(req, res, next)=>{
//     const id = req.params.productID;
//         res.status(200).json({
//             message : "Update success",
//             id : id
//         });
// })

router.delete('/:orderID' ,(req, res, next)=>{
        res.status(200).json({
            message : "Delete success",
            id : id
        });
})


module.exports = router;