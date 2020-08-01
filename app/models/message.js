'use strict'

let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let Message = Schema ({
    text: String,
    viewed: String,
    created_at: String,
    emmiter: {type: Schema.ObjectId, ref: 'User'},
    receiver: {type: Schema.ObjectId, ref: 'User'}
});


module.exports = mongoose.model('Message', Message);