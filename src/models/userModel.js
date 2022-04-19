const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userModel = new schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String
    }
},{
    timestamps:true
});

module.exports = mongoose.model("Admin",userModel);