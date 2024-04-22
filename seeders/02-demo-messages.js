'use strict';
const faker = require('faker');
faker.locale = 'fr';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
        `SELECT id FROM Users;`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    if (!users.length) {
      throw new Error('Aucun utilisateur trouvé pour associer des messages');
    }
    const userIds = users.map(user => user.id);
    const fakeMessages = [];
    for (let i = 0; i < 30; i++) {
      const userId = userIds[Math.floor(Math.random() * userIds.length)];
      fakeMessages.push({
        subject: faker.lorem.sentence(),
        body: faker.lorem.paragraphs(2),
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    await queryInterface.bulkInsert('Messages', fakeMessages);
    4/11
    const messages = await queryInterface.sequelize.query(
        `SELECT id FROM Messages;`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const messageIds = messages.map(message => message.id);
    for (let i = 0; i < 20; i++) {
      const isReply = Math.random() < 0.8;
      const replyToMessageId = isReply ? messageIds[Math.floor(Math.random() *
          messageIds.length)] : null;
      const userId = userIds[Math.floor(Math.random() * userIds.length)];
      fakeMessages.push({
        subject: faker.lorem.sentence(),
        body: faker.lorem.paragraphs(2),
        userId: userId,
        replyToMessageId: replyToMessageId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    await queryInterface.bulkInsert('Messages', fakeMessages);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Messages', null, {});
  }
};
