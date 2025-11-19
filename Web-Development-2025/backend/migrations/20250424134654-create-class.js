'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('classes', {
      id: {
        allowNull: false,
        unique: true,
        primaryKey: true,
        type: Sequelize.STRING(36),
        defaultValue: Sequelize.UUIDV4,
      },
      courseId: {
        type: Sequelize.STRING(36),
        defaultValue: Sequelize.UUIDV4,
        references: {
          model: 'courses',
          key: 'id'
        },
        onDelete: 'CASCADE',
        allowNull: false
      },
      teacherId: {
        type: Sequelize.STRING(36),
        defaultValue: Sequelize.UUIDV4,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        allowNull: false
      },
      name: {
        type: Sequelize.STRING
      },
      schedule: {
        type: Sequelize.TEXT
      },
      startDate: {
        type: Sequelize.DATE
      },
      endDate: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.ENUM("akan datang", "berjalan", "selesai"),
        defaultValue: "akan datang"
      },
      progress: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('classes');
  }
};