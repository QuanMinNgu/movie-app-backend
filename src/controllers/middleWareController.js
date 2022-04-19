const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
class middleWareController{ 
    verifyAdmin(req,res,next){
        try{
            const token = req.headers.token;
            if(!token){
                return res.status(400).json({msg:"Token không tồn tại."});
            }
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken,process.env.ACCESSTOKEN,async (err,user) => {
                if(err){
                    return res.status(400).json({msg:"Token không tồn tại."});
                }
                const newUser = await User.findById(user.id);
                if(!newUser){
                    return res.status(400).json({msg:":Tài khoản không hề tồn tại."});
                }
                next();
            })
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }
}

module.exports = new middleWareController;