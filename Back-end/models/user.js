const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userId = mongoose.Schema( {
    email : {
        type: String, 
        required: true, 
        unique: true, 
        match:/^[^\s@]+@[^\s@]+\.[^\s@]+$/ 
    },
    password :{
        type: String,
        required: true
    }
    })

userId.plugin(uniqueValidator)

module.exports = mongoose.model('User', userId);