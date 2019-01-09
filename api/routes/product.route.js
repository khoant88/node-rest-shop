const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth')
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

const Product = require('../models/product.model');3

router.get('/', (req, res, next) => {
    Product.find()
    .select('_id name price productImage')
    .exec()
    .then(result =>{
        const response = {
            count : result.length,
            products : result.map(doc =>{
                return {
                    name : doc.name,
                    price : doc.price,
                    _id : doc._id,
                    productImage : doc.productImage,
                    request :{
                        type : "GET",
                        url : "http://localhost:8888/products/" + doc._id
                    }
                }
            })
        }
        res.status(200).json(response);
    })
    .catch(err=>{
        res.status(500).json({error:err})
    });
    
})

router.post('/', upload.single('productImage'), checkAuth,   (req, res, next) => {
    const product = new Product({
            _id : new mongoose.Types.ObjectId(),
            name : req.body.name,
            price : req.body.price,
            productImage : req.file.path
    });
    product.save()
            .then(result =>{
                res.status(201).json({
                    message : "POST method",
                    product: {
                        name : result.name,
                        price : result.price,
                        _id : result._id,
                        productImage: result.productImage,
                        request :{
                            type : "GET",
                            url :"http://localhost:8888/products/" + result._id
                        }
                    }
                });
            })
            .catch(err => {
                res.status(500).json({error:err})
            })

    
})

router.get('/:productID' ,(req, res, next)=>{
    const id = req.params.productID;
    Product.findById(id)
    .select("_id name price")
    .exec()
    .then(doc => {
        if(doc){

            res.status(200).json(doc);
        }else{
            res.status(404).json({message:"khong tim thay san pham"});
        }
        
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        })
    })
})

router.patch('/:productID',(req, res, next)=>{
    console.log(req.file)
    const id = req.params.productID;
    const updateOps = {}
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }

    Product.update({_id: id}, {$set :updateOps})
    .exec()
    .then(result=>{
        res.status(200).json({
            message : "Update success",
            id : id
        });
    })
    .catch(err=>{
        res.status(500).json({error:err});
    })
        
})

router.delete('/:productID' ,(req, res, next)=>{
    var id = req.params.productID
    Product.remove({_id: id})
    .exec()
    .then( result =>{
        res.status(200).json(result)
    })
    .catch(err =>{
        res.status(500).json({
            error:err
        })
    });
})


module.exports = router;