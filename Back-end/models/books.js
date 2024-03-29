const mongoose = require('mongoose');

const bookShema = mongoose.Schema({
    userId: {type: String},
    title: {type: String},
    author:{type: String},
    imageuRL:{type: String},
    year:{type: Number},
    genre:{type: String},
    ratings:[{
        userId:{type: String},
        grade:{type: Number}
    }],
    averageRating: {type:Number}
})

module.exports = mongoose.model('Book', bookShema);