const express = require('express');
const userController = require('../controllers/user.controller');
// const { route } = require('../server');

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login );

module.exports = router;