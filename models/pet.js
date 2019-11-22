'use strict'

let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let Pet = Schema ({
    description: String,
    imagen: String,
    date: String,
    user: {type: Schema.ObjectId, ref: 'User'},
    owner: {type: Schema.ObjectId, ref: 'User'},
    estado: String,
    raza: String,
    color: String,
    sexo: String,
    ubicacion: {
        lat: String,
        lng: String
    },
    comment:[
        {
            date:String,
            user:String,
            text:String,
        }

    ]
});


module.exports = mongoose.model('Pet', Pet);