const validator = require('validator');
'use strict';
const {
  Model
} = require('sequelize');
const { options } = require('../routes/user');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    firstName: { 
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [3, 50],
          msg: 'First Name must be between 3 to 50 characters'
        }
      } 
    },
    lastName:{
     type: DataTypes.STRING,
     allowNull: false,
     allowNull: false,
      validate: {
        len: {
          args: [3, 50],
          msg: 'Last Name must be between 3 to 50 charactes'
        }
      }
    },
    email: {
     type: DataTypes.STRING,
     allowNull: false,
      validate: {
        isEmail: {
          msg: 'This is not a valid email'
        }
    }
    },
    password: {
      type:DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8, 100],
          msg: 'Password must be between 8 to 20 charactes'
        }
      }  
    },
    resetPasswordToken: DataTypes.STRING,
    resetPasswordExpire: DataTypes.DATE
  },
    {
    sequelize,
    modelName: 'User',
  });

  //Encrypt password using bcrypt
  const bcrypt = require('bcryptjs');
  User.beforeCreate((user, options) => {
    console.log("Before create called");
    return bcrypt.hash(user.password, 10)
        .then(hash => {
            user.password = hash;
        })
        .catch(err => { 
            throw new Error(); 
        });
  });
 
  return User;
};