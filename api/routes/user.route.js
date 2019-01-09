const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const User = require('../models/user.model');

router.post('/login', (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length <1 ){
            res.status(404).json({
                message : "Email not found"
            })
        }else{
            bcrypt.compare(req.body.password, user[0].password, (err, result)=>{
               
                if(err){
                    
                    return res.status(401).json({
                        message :" Auth fail"
                    })
                }
                if(result){
                    const token = jwt.sign({
                        email : user[0].email,
                        userID : user[0]._id
                    },
                    "secret_key_generate"
                    )
                    return res.status(200).json({
                        message : "Auth success",
                        token : token
                    })
                }
                return res.status(401).json({
                    message :" Auth fail 2"
                })
            })
        }
    })
    .catch(err =>{
        res.status(500).json({
            error : err
        })
    })
})

router.post('/signup',  (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user =>{
        if(user.length >=1){
            res.status(409).json({
                message : "email exists"
            })
        }else{
            bcrypt.hash(req.body.password, 10, function(err, hash){
                console.log(err);
                if(err){
                    console.log("a");
                    res.status(500).json({
                        message: "Can not create user"
                    })
                }else{
                    console.log("b");
                    const user = new User({
                        _id : new mongoose.Types.ObjectId(),
                        email : req.body.email,
                        password : hash})
                    user.save()
                    .then(user =>{
                        res.status(201).json({
                            message: "User created",
                            data : user
                        })
                    })
                    .catch(err => {
                        res.status(400).json({
                            message: "Can not create user"
                        })
                    });
                }
            })
        }
    })
 })

router.get('/:userID' ,(req, res, next)=>{
    
})

router.patch('/:userID',(req, res, next)=>{  
        
})

router.delete('/:userID' ,(req, res, next)=>{
    
})


module.exports = router;