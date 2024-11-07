const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
    },
    reg_no:{
        type:String,
        required: true,
        unique: true,
        match: /^[A-Za-z0-9]+$/,
    },
    email:{
        type: String,
        required: true,
        match:/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    }
},{timestamps:true})

const Person = mongoose.model('user',userSchema)
module.exports=Person