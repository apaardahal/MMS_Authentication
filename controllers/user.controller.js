const models = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


//@description      Register User
//@route            POST /api/v1/auth/register
//@access            Public
const register = async (req, res) =>{

    const { firstName, lastName, email, password } = req.body;

   //Create User
   const user = await models.User.create({
        firstName,
        lastName,
        email,
        password
    });
    
    res.status(201).send({
        success: true,
        message: "User created successfully",
		data: user
	});
}



module.exports = {
    register: register
}
