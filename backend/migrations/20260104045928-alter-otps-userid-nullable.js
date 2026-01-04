'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('otps', 'userId', {
      type: Sequelize.STRING(36),
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('otps', 'userId', {
      type: Sequelize.STRING(36),
      allowNull: false
    });
  }
};
