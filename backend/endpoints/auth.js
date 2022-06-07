const { AuthController } = require('../controllers/index').controllers;
const Router = require('express').Router;

// initialize User router
const Auth = Router();

// access controllers

Auth.post('/', AuthController.login); // localhost:3001/user/login
Auth.get('/', AuthController.checkifloggedin);  
Auth.post('/verifyEmail', AuthController.verifyEmail)
Auth.post('/verifyQNA',AuthController.verifyQNA)
Auth.post('/forgotpassword',AuthController.changePassword)
Auth.delete('/', AuthController.logout)

module.exports = Auth;
