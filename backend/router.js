const { User, Student, Auth, Message } = require('./endpoints/index').endpoints;
const Router = require('express').Router;

// initialize router
const router = Router();

// add different routes
router.use('/user', User); // loclahost:3001/user
router.use('/student', Student); // localhost:3001/student
router.use('/auth', Auth); // localhost:3001/auth
router.use('/message', Message); // localhost:3001/message

module.exports = router;