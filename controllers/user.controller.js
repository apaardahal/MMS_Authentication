const models = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sef = require(`sequelize-express-findbyid`)
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');

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
                  }, 'JWT_SECRET', (err, token) => {
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

//@description      Get all Users
//@route            GET /api/v1/users
//@access            Public
const getUsers = async(req, res, next) => {
    try {
        const users = await models.User.findAll();

        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        res.status(400).json({
            success: false
        })
    }
}

//@description      Get single User
//@route            GET /api/v1/user/:id
//@access            Public
const getSingleUser = async(req, res, next) => {
    
    try {
        const findById = sef(User);
        const user = await findById(req.params.id);

        res.status(200).json({
            success: true,
            data: user
        })
    } catch (error) {
        res.status(400).json({
            success:false
        })
    }
}

//@description      Forget password
//@route            GET /api/v1/user/forgotpassword
//@access            Public
const forgotpassword = async(req, res, next) => {
    //ensure that you have a user with this email
  var email = await models.User.findOne({where: { email: req.body.email }});
  if (!email) {
    return next(new ErrorResponse('There is no user with that email', 404));
  }
else{
      //Get Reset Token
    const resetToken = crypto.randomBytes(20).toString('hex');
    console.log(resetToken);
    //Hash the token 
     const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    //token expires after one hour
  var resetPasswordExpire = new Date();
  resetPasswordExpire.setDate(resetPasswordExpire.getDate() + 1/24);

        const dataWithToken = await models.User.update({
            resetPasswordExpire: resetPasswordExpire,
            resetPasswordToken: resetPasswordToken
        }, {where: {email: req.body.email}})

        //Create reset URL 
        const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;

        const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
        await sendEmail({
        email: req.body.email,
        subject: 'Password reset token',
        message
        });

        res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
        console.log(err);
        // user.resetPasswordToken = undefined;
        // user.resetPasswordExpire = undefined;
        return next(new ErrorResponse('Email could not be sent', 500));
    }

            res.status(200).json({
                success: true,
                data: resetPasswordToken
            });
    }
    }

module.exports = {
    register: register,
    login: login,
    getUsers: getUsers,
    getSingleUser: getSingleUser,
    forgotpassword: forgotpassword
}
