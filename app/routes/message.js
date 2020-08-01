'use strict'

var express = require('express');
var MessageController = require('../controllers/messages');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.get('/probando-message', md_auth.ensureAuth, MessageController.probando);
api.post('/message', md_auth.ensureAuth, MessageController.saveMessage);
api.get('/my-messages',md_auth.ensureAuth, MessageController.getReceivedMessages);
api.get('/messages',md_auth.ensureAuth, MessageController.getEmmitedMessages);
api.get('/unviewed-messages', md_auth.ensureAuth, MessageController.getUnviewedMessages);
api.get('/set-viewed-messages', md_auth.ensureAuth, MessageController.setViewedMessages);
api.get('/my-messages/:id', md_auth.ensureAuth, MessageController.getSpecificReceivedMessage);

module.exports = api; 
