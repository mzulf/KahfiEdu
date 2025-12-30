'use strict';
const { v4: uuid4 } = require('uuid')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const [usersParent] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email = 'parent@example.com' LIMIT 1;`
    );

    const parent = usersParent.length ? usersParent[0].id : null;
    const date_of_birth = '2018-07-16'

    await queryInterface.bulkInsert('childrens', [
      {
        id: uuid4(),
        parentId: parent,
        name: 'Children 1',
        date_of_birth: new Date(date_of_birth),
        age: 20,
        gender: 'perempuan',
        relationship: 'anak',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('childrens', null, {})
  }
};
