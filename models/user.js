const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    email: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    service: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    barber: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    message: {
        type: String,
        trim: true,
        required: true,
        maxlength: 100
    },
    date: {
        type: Date,
        trim: true,
        required: true,
        maxlength: 32
    },
    time:{
        type:String,
        trim: true,
        required: true,
        maxlength: 5
    },
    status: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },



}, { timestamps: true })
module.exports = mongoose.model("User", userSchema)