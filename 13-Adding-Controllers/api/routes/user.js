/*eslint-env es6*/
const express = require('express'); //To include the express module and help manage server and routes.
const router = express.Router(); //Routing refers to how an application’s endpoints (URIs) respond to client requests
const checkAuth = require('../middleware/check-auth');// to authenticate when someone want to delete account

const UserController = require('../controllers/user'); // take all Expressions(Controllers) with arrow function to use it when we handle Requests below

router.post('/signup', UserController.user_signup /* <= use Expression (Controller) instead whole anonymous arrow function */);

router.post('/login', UserController.user_login /* <= use Expression (Controller) instead whole anonymous arrow function */);

router.delete('/removeAccount', checkAuth, UserController.user_delete /* <= use Expression (Controller) instead whole anonymous arrow function */);

module.exports = router;
