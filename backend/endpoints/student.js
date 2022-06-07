const { StudentController } = require('../controllers/index').controllers;
const Router = require('express').Router;

// initialize User router
const Student = Router();

// access controllers
Student.post('/', StudentController.addStudent);
Student.get('/edits', StudentController.getEditHistory);
Student.get('/:id', StudentController.getStudent);
Student.get('/', StudentController.getStudents);
Student.put('/:id', StudentController.editStudent);
Student.delete('/', StudentController.deleteStudent);


module.exports = Student;