'use strict';


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('class_enrollments', {
      id: {
        allowNull: false,
        unique: true,
        primaryKey: true,
        type: Sequelize.STRING(36),
        defaultValue: Sequelize.UUIDV4,
      },
      classId: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: {
          model: 'classes',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      studentId: {
        type: Sequelize.STRING(36),
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE',
      },
      childId: {
        type: Sequelize.STRING(36),
        allowNull: true,
        references: {
          model: 'childrens',
          key: 'id'
        },
        onDelete: 'CASCADE',
      },
      progress: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      enrolledAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('active', 'completed', 'pending'),
        defaultValue: 'pending',
        allowNull: false,
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
    await queryInterface.dropTable('class_enrollments');
  }
};