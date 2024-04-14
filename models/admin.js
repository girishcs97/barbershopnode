const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    username:{
        type:String,
        trim:true,
        required:true,
        maxlength:32
    },
    password:{
        type:String,
        trim:true,
        required:true,
        unique:true,
        maxlength:32
    }
},{timestamps:true})
module.exports = mongoose.model("Admin",adminSchema)