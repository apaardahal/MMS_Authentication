const express = require('express');
const userController = require('../controllers/user.controller');



const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login );
router.get('/users', userController.getUsers );
router.get('/user/:id', userController.getSingleUser);
router.post('/forgotpassword', userController.forgotpassword);
module.exports = router;