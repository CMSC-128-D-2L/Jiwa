const { UserController, AuthController } = require('../controllers/index').controllers;
const Router = require('express').Router;

// initialize User router
const User = Router();

// access controllers
User.post('/', UserController.signUp);
User.get('/:id', UserController.findUser); 
User.get('/', UserController.findUsers)
User.put('/:id', UserController.editUser);
User.delete('/', UserController.deleteUser);

module.exports = User;
