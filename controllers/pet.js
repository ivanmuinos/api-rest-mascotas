'use strict'

var path = require('path');
var moment = require('moment');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Pet = require('../models/pet');
var User = require('../models/user');


function prueba(req, res){
	if(req.params.nombre){
		var nombre = req.params.nombre;
	}else{
		var nombre = "SIN NOMBRE";
	}
	fs.writeFile("/Users/ivanmuinos/Desktop", "hola", (err)=>{
		if(err){
			return console.log(err);
		}
		console.log("fue guardada");
	} )
	res.status(200).send({
					data: [2,3,4],
					message: "Ejemplo ApiRest con nodeJS y EXPRESS" + " - " + nombre
					});
}

function getPet(req, res){
	var petId = req.params.id;

	Pet.findById(petId, function(err, pet){
		if(err){
			res.status(500).send({message: 'Error al devolver la mascosta'});
		}
		if(!pet){
			res.status(404).send({message: 'La mascota no existe'});
		}else{
			res.status(200).send({pet});
		}
		
	});	

}

function getPetsOfUser(req, res){
	Pet.find({user: req.user.sub}).exec((err, pets) => {
		if(err) return res.status(500).send({message: 'Error al recuperar mascotas'});
		if(!pets) return res.status(404).send({message: 'No publicaste ninguna mascota'});
		return res.status(200).send({pets});
	});
}

function getPets(req, res){
	Pet.find({}).sort('-_id').exec((err, pets) => {
		if(err){
			res.status(500).send({message: 'Error al devolver los mascotas'});
		}else{
			if (!pets){
				res.status(404).send({message: 'No hay mascotas'});
			}else{
				res.status(200).send({pets});
			}
		}
	});
	
}


function savePet(req, res){
	let now = moment();
	var params = req.body;

	if(!params.description) return res.status(200).send({message: 'Se requiere una descripcion'});
	
	var pet = new Pet();
    pet.description = params.description;
    pet.imagen = null;
    pet.date = now.format();
    pet.user = req.user.sub;
    pet.raza = params.raza;
    pet.color = params.color;
    pet.sexo = params.sexo;
    pet.ubicacion = null;
    pet.estado = params.estado;

	pet.save((err, petStored) => {
		if(err) return res.status(500).send({message: 'Error al guardar la mascota'});
		if(!petStored) return res.status(404).send({message: 'La mascota no ha sido guardada'});
		return res.status(200).send({pet: petStored});
	});
}

function uploadImagePet(req, res){
	var petId = req.params.id;

	//TODO falta verificar que solo el dueño de la mascota pueda subir la foto.
	console.log(req.files);
	if(req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('/');
		
		var file_name = file_split[2];
		
		var ext_split = file_name.split('.');
		var file_ext = ext_split[1];
		console.log(file_ext);
		if(file_ext ==  'png' || file_ext == 'jpg' || file_ext == 'jpeg'){
			//Actualizar datos del usuario
			Pet.findByIdAndUpdate(petId, {imagen: file_name}, {new:true}, (err, petUpdated) => {
				if(err) return res.status(500).send({message: 'Error al actualizar el usuario'});
				if(!petUpdated) return res.status(404).send({message: 'No se pudo actualizar el usuario'});
				return res.status(200).send({pet: petUpdated});	
			});
		}else{
			return removeFilesOfUploads(res, file_path, 'Extension no valida');
		}

	}else{
		return res.status(200).send(console.log("error 200"));
	}
}

function removeFilesOfUploads(res, file_path, message){
	fs.unlink(file_path, (err) => {
		return res.status(200).send({message: message});
	});
}

function getImageFile(req, res){
	var image_file = req.params.imageFile;
	
	var path_file = './uploads/pets/' + image_file;
	
	fs.exists(path_file, (exists) => {
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message: 'No existe la imagen'});
		}
	});
}

function updatePet(req, res){
	var petId = req.params.id;
	var update = req.body;

	Pet.findByIdAndUpdate(petId, update, (err, petUpdated) =>{
		if(err){
			res.status(500).send({message: 'Error al guardar el marcador'});
		}else{
			res.status(200).send({pet: petUpdated});
		}
	});
	
}

function deletePet(req, res){
	var favoritoId = req.params.id;

	Favorito.findById(favoritoId, function(err, favorito){
		if(err){
			res.status(500).send({message: 'Error al devolver los marcadores'});
		}
		if(!favorito){
			res.status(404).send({message: 'No hay marcadores'});
		}else{
			favorito.remove(err => {
				if(err){
					res.status(500).send({message: 'Error al borrar'});	
				}else{
					res.status(200).send({message: 'El marcador se ha eliminado'});
				}
			});
		}
		
	});	
	
}

module.exports = {
	prueba,
	getPets,
	getPet,
	savePet,
	updatePet,
	deletePet,
	getPetsOfUser,
	uploadImagePet,
	getImageFile
}