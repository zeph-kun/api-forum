'use strict';
const faker = require('faker');
const bcrypt = require('bcrypt');
faker.locale = 'fr';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const fakeUsers = [];
    for (let i = 0; i < 10; i++) {
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      const rawPassword = firstName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '');
      const passwordHash = await bcrypt.hash(rawPassword, 10);
      fakeUsers.push({
        firstName: firstName,
        lastName: lastName,
        email: faker.internet.email(firstName, lastName),
        password: passwordHash,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    await queryInterface.bulkInsert('Users', fakeUsers);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
