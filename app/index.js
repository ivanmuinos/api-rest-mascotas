'use strict'

let mongoose = require('mongoose');
let app = require('./app');

let port = process.env.PORT || 3700;

let DATABASE_CONNECTION = 'mongodb://mongo:27017/appets'

mongoose.connect(DATABASE_CONNECTION, (err, res) => {
	if(err){
		throw err;
	}else{
		console.log("Base de datos funcionando correctamente...");
		app.listen(port, function(){
			console.log(`API RESTful de albums funcionando en http://localhost:${port}`);
		});
		
	}
});