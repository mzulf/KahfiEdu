'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    static associate(models) {
      User.hasMany(models.Otp, {
        foreignKey: 'userId',
        as: 'otps',
        onDelete: 'CASCADE'
      });
      User.hasMany(models.Class, {
        foreignKey: 'teacherId',
        as: 'classes',
        onDelete: 'CASCADE'
      });
      User.hasMany(models.Payment, {
        foreignKey: 'userId',
        as: 'payments',
        onDelete: 'CASCADE'
      });
      User.hasMany(models.Child, {
        foreignKey: 'parentId',
        as: 'childrens',
        onDelete: 'CASCADE',
      });

      User.belongsTo(models.Role, {
        foreignKey: 'roleId',
        as: 'role',
        onDelete: 'CASCADE',
      });

      User.hasMany(models.Revision, {
        foreignKey: 'userId',
        as: 'revisions',  // Changed back to lowercase 'revisions'
        onDelete: 'CASCADE',
      });
    }

    static async hashPassword(password) {
      const salt = await bcrypt.genSalt(10);
      return bcrypt.hash(password, salt);
    }

    static async verifyPassword(inputPassword, hashedPassword) {
      return bcrypt.compare(inputPassword, hashedPassword);
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      alamat: {
        type: DataTypes.STRING,
        allowNull: true
      },
      province: {
        type: DataTypes.STRING,
        allowNull: true
      },
      regency: {
        type: DataTypes.STRING,
        allowNull: true
      },
      district: {
        type: DataTypes.STRING,
        allowNull: true
      },
      gender: {
        type: DataTypes.ENUM('laki-laki', 'perempuan'),
        allowNull: true
      },
      village: {
        type: DataTypes.STRING,
        allowNull: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      emailVerified: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      roleId: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        references: {
          model: 'roles',
          key: 'id'
        },
        onDelete: 'CASCADE',
        allowNull: false
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      googleId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
      },
    },
    {
      sequelize,
      modelName: 'User',
      paranoid: true, // enable soft delete (adds deletedAt)
      timestamps: true, // default true, but better to be explicit
      hooks: {
        beforeCreate: async (user) => {
          if (!user.id) {
            user.id = uuidv4();
          }
          if (user.password) {
            user.password = await User.hashPassword(user.password);
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed('password')) {
            user.password = await User.hashPassword(user.password);
          }
        }
      }
    }
  );

  return User;
};
