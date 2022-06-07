const { MessageController } = require('../controllers/index').controllers;
const Router = require('express').Router;

// initialize User router
const Message = Router();

// access controllers

Message.post('/', MessageController.addMessage);
Message.get('/', MessageController.showMessages);
Message.put('/', MessageController.editMessage);
// Message.delete('/:id', MessageController.deleteMessage);

module.exports = Message;
