'use strict'
 
var express = require('express');
var PetController = require('../controllers/pet');
var api = express.Router();
var md_auth = require('../middlewares/authenticated'); 

var multipart = require('connect-multiparty');
var md_upload = multipart( { uploadDir: './uploads/pets'} );
//var md_upload = multipart( { uploadDir: '../../webapp-mascotas/public/petImages/'} );

api.get('/prueba/:nombre?', PetController.prueba);
api.get('/pet/:id', PetController.getPet);
api.get('/pet', PetController.getPets);
api.get('/pet-user', md_auth.ensureAuth, PetController.getPetsOfUser);
api.post('/pet',md_auth.ensureAuth, PetController.savePet);
api.put('/pet/:id', PetController.updatePet);
api.post('/upload-image-pet/:id', [md_auth.ensureAuth, md_upload], PetController.uploadImagePet);
api.post('/add-comment/:id',md_auth.ensureAuth, PetController.addComment);
api.delete('/pet/:id', PetController.deletePet);
api.get('/get-image-pet/:imageFile', PetController.getImageFile);

module.exports = api;