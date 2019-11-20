'use strict'

var User = require('../models/user');
var Pet = require('../models/pet');

var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');

//prueba
function prueba(req, res) {
	if (req.params.nombre) {
		var nombre = req.params.nombre;
	} else {
		var nombre = "SIN NOMBRE";
	}


	res.status(200).send({
		data: [2, 3, 4],
		message: "Ejemplo ApiRest con nodeJS y EXPRESS" + " - " + nombre
	});

}

function getUser(req, res) {
	var userId = req.params.id;

	User.findById(userId, function (err, user) {
		if (err) return res.status(500).send({ message: 'Error al devolver el usuario' });
		if (!user) return res.status(404).send({ message: 'El usuario no existe' });
		return res.status(200).send({ user });
	});
}


function getUsers(req, res) {
	User.find({}).sort('-_id').exec((err, users) => {
		if (err) {
			res.status(500).send({ message: 'Error al devolver los usuarios' });
		} else {
			if (!users) {
				res.status(404).send({ message: 'No hay usuarios' });
			} else {
				res.status(200).send({ users });
			}
		}
	});

}

//registro de usuario
function saveUser(req, res) {
	var user = new User();
	var params = req.body;

	if (params.name && params.surname && params.password && params.email) {
		user.name = params.name;
		user.surname = params.surname;
		user.email = params.email;
		user.mobile = params.mobile;
		user.image = null;
		user.favorites = null;
		user.role = 'ROLE_USER';

		//Verifico si el usuario ya existe.
		User.findOne({
			$or: [
				{ email: user.email.toLowerCase() }
			]
		}).exec((err, users) => {
			if (err) return res.status(500).send({ message: 'Error en la peticion de usuarios' });

			if (users && Object.keys(users).length >= 1) {
				return res.status(200).send({ message: 'El usuario ya existe' });
			} else {
				bcrypt.hash(params.password, null, null, (err, hash) => {
					user.password = hash;

					user.save((err, userStored) => {

						if (err) return res.status(500).send({ message: 'Error al guardar el usuario' });

						if (userStored) {

							res.status(200).send({ user: userStored });
						} else {
							res.status(404).send({ message: 'No se ha encontrado el usuario' });
						}
					});
				});
			}
		});


	} else {
		res.status(200).send({
			message: 'Hay campos que faltan completar'
		});
	}

}

//login
function loginUser(req, res) {
	var params = req.body;

	var email = params.email;
	var password = params.password;

	User.findOne({ email: email }, (err, user) => {
		if (err) return res.status(500).send({ message: 'Error en la peticion' });

		if (user) {
			bcrypt.compare(password, user.password, (err, check) => {
				if (check) {

					if (params.gettoken) {
						//devolver token
						return res.status(200).send({
							token: jwt.createToken(user)
						});
					} else {
						//devolver datos de usuario
						user.password = undefined;
						return res.status(200).send({ user });
					}
				} else {
					return res.status(404).send({ message: 'El usuario no se ha podido identificar' });
				}
			});
		} else {
			return res.status(404).send({ message: 'El usuario no se ha podido identificar' });
		}

	});

}

//get data user
function getDataUser(req, res) {
	var userId = req.params.id;

	User.findOne({ _id: userId }, (err, user) => {
		if (err) return res.status(500).send({ message: 'Error en la peticion' });
		if (!user) return res.status(404).send({ message: 'El usuario no se ha podido identificar' });
		return res.status(200).send({ user });
	});

}

//Actualizar los datos de un usuario
function updateUser(req, res) {
	var userId = req.params.id;
	var update = req.body;

	//borrar password
	delete update.password;

	if (userId != req.user.sub) return res.status(500).send({ message: 'No tienes permisos para actualizar los datos del usuario' });

	User.findByIdAndUpdate(userId, update, { new: true }, (err, userUpdated) => {
		if (err) return res.status(500).send({ message: 'Error al actualizar el usuario' });
		if (!userUpdated) return res.status(404).send({ message: 'No se pudo actualizar el usuario' });
		return res.status(200).send({ user: userUpdated });
	});
}

//este todavia no lo probe.
function deleteUser(req, res) {
	var userId = req.params.id;

	User.findById(userId, function (err, user) {
		if (err) {
			res.status(500).send({ message: 'Error al querer eliminar un usuario' });
		}
		if (!user) {
			res.status(404).send({ message: 'El usuario no existe' });
		} else {
			user.remove(err => {
				if (err) {
					res.status(500).send({ message: 'Error al querer eliminar el usuario' });
				} else {
					res.status(200).send({ message: 'El usuario se ha eliminado' });
				}
			});
		}

	});

}

//Subir archivos de imagen/avatar de usuario
function uploadImage(req, res) {
	var userId = req.params.id;

	console.log(req.files);
	if (req.files) {
		var file_path = req.files.image.path;
		var file_split = file_path.split('/');

		var file_name = file_split[2];

		var ext_split = file_name.split('.');
		var file_ext = ext_split[1];

		if (userId != req.user.sub) {
			return removeFilesOfUploads(res, file_path, 'No tienes permiso para actualizar los datos del usuario');
		}

		if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg') {
			//Actualizar datos del usuario
			User.findByIdAndUpdate(userId, { image: file_name }, { new: true }, (err, userUpdated) => {
				if (err) return res.status(500).send({ message: 'Error al actualizar el usuario' });
				if (!userUpdated) return res.status(404).send({ message: 'No se pudo actualizar el usuario' });
				return res.status(200).send({ user: userUpdated });
			});
		} else {
			console.log("pasa x aca");
			return removeFilesOfUploads(res, file_path, 'Extension no valida');
		}

	} else {
		return res.status(200).send({ message: 'No se ha subido una imagen' });
	}
}

function removeFilesOfUploads(res, file_path, message) {
	fs.unlink(file_path, (err) => {
		return res.status(200).send({ message: message });
	});
}

function getImageFile(req, res) {
	var image_file = req.params.imageFile;

	var path_file = './uploads/users/' + image_file;

	fs.exists(path_file, (exists) => {
		if (exists) {
			res.sendFile(path.resolve(path_file));
		} else {
			res.status(200).send({ message: 'No existe la imagen' });
		}
	});
}

function addFavorite(req, res) {
	var petId = req.params.id;

	var favorite = {
		_id: petId
	};

	User.findOne({
		favorites: { $nin: petId }
	}).exec((err, user) => {
		if (err) return res.status(500).send({ message: 'Error en la peticion' });
		if (!user) {
			res.status(404).send({ message: 'Ya agregaste el favorito'});
		}else{
			if (Array.isArray(user.favorites)) {
				user.favorites.push(favorite);
			} else {
				user.favorites = [favorite];
			}
			user.save(res);
			return res.status(200).send({ user });
		}
	});
}

function deleteFavorite(req, res){
	var petId = req.params.id;

	var favorite = {
		_id: petId
	};

	User.findOne({
		favorites: { $in: petId }
	}).exec((err, user) => {
		if (err) return res.status(500).send({ message: 'Error en la peticion' });
		if (!user) {
			res.status(404).send({ message: 'El favorito no existe'});
		}else{
	
			user.favorites.pull(favorite);
		
			user.save(res);
			return res.status(200).send({ user });
		}
	});
}

function getFavoriteData(req, res){
	var userId = req.params.id;

	User.find({_id: userId}).populate('favorites').exec( (err, user) => {
		if(err) return res.status(500).send({message: 'Error en la peticion'});
        if(!user) return res.status(404).send({message: 'No hay mensajes para mostrar'});
        return res.status(200).send({user});
	})

}


module.exports = {
	prueba,
	getUsers,
	getUser,
	saveUser,
	updateUser,
	deleteUser,
	loginUser,
	updateUser,
	uploadImage,
	getImageFile,
	addFavorite,
	getDataUser,
	getFavoriteData,
	deleteFavorite
}