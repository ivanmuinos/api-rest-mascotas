'use strict'

let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let User = Schema ({
    name: String,
    surname: String,
    password: String,
    email: String,
    mobile: String,
    image: String,
    favorites: [{
        type: Schema.ObjectId, ref: 'Pet'
    }],
    role: String
});


module.exports = mongoose.model('User', User);