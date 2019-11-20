'use strict'
 
var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/users'});
console.log(md_upload);
api.get('/pruebas',md_auth.ensureAuth, UserController.prueba);
api.get('/user/:id', md_auth.ensureAuth, UserController.getUser);
api.get('/user', UserController.getUsers);
api.get('/data-user/:id', UserController.getDataUser);
api.get('/get-image-user/:imageFile', UserController.getImageFile);
api.get('/get-favorite-data/:id', UserController.getFavoriteData);
api.post('/user', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.put('/user/:id', UserController.updateUser);
api.put('/user-add-favorite/:id', md_auth.ensureAuth, UserController.addFavorite);
api.delete('/user/:id', md_auth.ensureAuth, UserController.deleteUser);
api.delete('/delete-favorite/:id', md_auth.ensureAuth, UserController.deleteFavorite);


module.exports = api;