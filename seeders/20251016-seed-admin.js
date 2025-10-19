'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const password = 'ChangeMe123!'; // instruct to change
    const passwordHash = await bcrypt.hash(password, 10);

    await queryInterface.bulkInsert('Admins', [{
      email: 'admin@example.com',
      passwordHash,
      name: 'Main Admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Admins', { email: 'admin@example.com' }, {});
  }
};
