'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(36),
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      alamat: Sequelize.STRING,
      province: Sequelize.STRING,
      regency: Sequelize.STRING,
      district: Sequelize.STRING,
      village: Sequelize.STRING,

      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      isVerified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      verifiedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      emailVerified: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      gender: {
        type: Sequelize.ENUM('laki-laki', 'perempuan'),
        allowNull: true,
      },

      phone: Sequelize.STRING,
      avatar: Sequelize.STRING,

      googleId: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },

      roleId: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: {
          model: 'roles',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: Sequelize.DATE,
      deletedAt: Sequelize.DATE
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('users');
  }
};
