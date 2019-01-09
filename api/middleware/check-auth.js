const jwt = require('jsonwebtoken')

module.exports = (req, res, next) =>{
    try{
        const token = req.headers.token;
        var decode_token = jwt.verify(token, "secret_key_generate");
        res.userData = decode_token;
        next()
    }catch(err){
        return res.status(401).json({
            message : "token khong dung"
        })
    };
    
}