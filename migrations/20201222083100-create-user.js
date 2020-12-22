'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
        minlength: 3,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
        minlength: 3
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        match: [ /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/, 'Please add a valid email address' ]
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};