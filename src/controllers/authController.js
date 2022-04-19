const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class authController{
    async register(req,res){
        try{
            const {email,password} = req.body;
            const hashed = await bcrypt.hash(password,10);
            const user = new User({
                email,
                password:hashed
            });
            await user.save();
            return res.status(200).json({msg:"Register Successfully."});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }

    async login(req,res){
        try{
            const {email,password} = req.body;
            const user = await User.findOne({email});
            if(!user){
                return res.status(400).json({msg:"Tài khoản không tồn tại."});
            }
            const validPassword = await bcrypt.compare(password,user.password);
            if(!validPassword){
                return res.status(400).json({msg:"Mật khẩu hoặc tài khoản không chính xác."});
            }
            const accessToken = createAccessToken(user);
            const refreshToken = createRefreshToken(user);
            res.cookie("refreshToken",refreshToken,{
                httpOnly:true,
                secure:false,
                sameSite:"Strict",
                path:"/"
            });
            return res.status(200).json({accessToken,msg:"Đăng nhập thành công."});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }

    async logOut(req,res){
        try{
            res.clearCookie("refreshToken");
            return res.status(200).json({msg:"Đăng Xuất Thành Công."});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }
}

function createAccessToken(user){
    return jwt.sign({id:user._id},process.env.ACCESSTOKEN,{expiresIn:"1d"});
}
function createRefreshToken(user){
    return jwt.sign({id:user._id},process.env.REFRESHTOKEN,{expiresIn:"7d"});
}
module.exports = new authController;