'use strict'

let express = require('express');
let bodyParser = require('body-parser');
let app = express();

//Aca van a ir las rutas que me traigo para las diferentes peticiones.
let pet_routes = require('./routes/pet');
let user_routes = require('./routes/user');
let message_routes = require('./routes/message');

//middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
 
    next();
});

//Aca se cargan las rutas base.
app.use('/api', pet_routes);
app.use('/api', user_routes);
app.use('/api', message_routes);



module.exports = app;

