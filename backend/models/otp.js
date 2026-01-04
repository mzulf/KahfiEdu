'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Otp extends Model {
    static associate(models) {
      // OPTIONAL RELATION
      Otp.belongsTo(models.User, {
        foreignKey: 'userId',
        constraints: false
      });
    }
  }

  Otp.init({
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.STRING(36),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiredAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    tempData: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.fn('NOW'),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Otp',
    tableName: 'otps',
    timestamps: true,
    paranoid: true,
  });

  return Otp;
};
