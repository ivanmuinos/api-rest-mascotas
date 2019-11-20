'use strict'

var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');
var Pet = require('../models/pet');
var Message = require('../models/message');

function probando(req, res){
    res.status(200).send({message: 'Probando'});
}

//Enviar un mensaje
function saveMessage(req, res){
    var params = req.body;
    console.log(params.text);
    if(!params.text || !params.receiver)  res.status(200).send({message: 'Envia los datos necesarios'});
       
    var message = new Message();
    message.emmiter = req.user.sub;
    message.receiver = params.receiver;
    message.text = params.text;
    message.created_at = moment().unix();
    message.viewed = false;

    console.log(message);

    message.save((err, messageStored) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});
        if(!messageStored) return res.status(404).send({message: 'Error al enviar el mensaje'});
        return res.status(200).send({message: messageStored});
    });
}

//obtener mensajes recibidos
function getReceivedMessages(req, res){
    var userId = req.user.sub;

    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 50;

    Message.find({receiver: userId}).populate('emmiter').paginate(page, itemsPerPage, (err, messages, total) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});
        if(!messages) return res.status(404).send({message: 'No hay mensajes para mostrar'});
        return res.status(200).send({
            total: total,
            pages: Math.ceil(total/itemsPerPage),
            messages
        });
    });

}

function getSpecificReceivedMessage(req, res){
    var idMessage = req.params.id;
    Message.findById(idMessage, (err, message) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});
        if(!message) return res.status(404).send({message: 'No hay mensajes para mostrar'});
        return res.status(200).send({message});
    })
}

//obtener mensajes enviados
function getEmmitedMessages(req, res){
    var userId = req.user.sub;

    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 10;

    Message.find({emmiter: userId}).populate('emmiter receiver').paginate(page, itemsPerPage, (err, messages, total) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});
        if(!messages) return res.status(404).send({message: 'No hay mensajes para mostrar'});
        return res.status(200).send({
            total: total,
            pages: Math.ceil(total/itemsPerPage),
            messages
        });
    });

}

//contar los mensajes no leidos
function getUnviewedMessages(req, res){
    var userId = req.user.sub;

    Message.count({receiver:userId, viewed:'false'}).exec((err, count) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});
        return res.status(200).send({
            'unviewed': count
        });
    });
}

//marcar como leido los mensajes
function setViewedMessages(req, res){
    var userId = req.user.sub;

    Message.update({receiver:userId, viewed:'false'}, {viewed:'true'}, {"multi":true}, (err, messageUpdated) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});
        return res.status(200).send({
            messages:messageUpdated
        });
    });
}

module.exports = {
    probando,
    saveMessage,
    getReceivedMessages,
    getEmmitedMessages,
    getUnviewedMessages,
    setViewedMessages,
    getSpecificReceivedMessage
}