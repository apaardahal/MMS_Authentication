const models = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const ErrorResponse = require('../utils/errorResponse');
//@description      Register User
//@route            POST /api/v1/auth/register
//@access            Public
const register = async (req, res, next) =>{
    
     const { firstName, lastName, email, password } = req.body;

    try {
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
    } catch (err) {
        if (err.name === 'SequelizeValidationError') {
          return res.status(400).json({
            success: false,
            msg: err.errors.map(e => e.message)
          })
        } else {
          next(new ErrorResponse(`Sorry, could not save ${req.body.name}`, 404))
        }
      }   
}

//@description      Login User
//@route            POST /api/v1/auth/login
//@access            Public

const login = async(req, res, next) => {
    const {email, password} = req.body;

    //Validate email and password
    if(!email || !password){
        return next(new ErrorResponse('Please provide email and password', 400));
    }

    //Check for user
    const user = await models.User.findOne({where:{email: email}});

    if(!user){
        return next(new ErrorResponse('Invalid Credentials', 401));
    }
    else{
        bcrypt.compare(password, user.password, (err, result) => {
            if(result){
                const token = jwt.sign({
                    email: user.email
                }, 'secret', (err, token) => {
                    res.status(200).json({
                        message: 'Authentication successful!',
                        token: token
                    });
                });
            }
            else{
                res.status(401).json({
                    message: 'Invalid Credentials'
                });
            }
        });
    }

}

module.exports = {
    register: register,
    login: login
}
