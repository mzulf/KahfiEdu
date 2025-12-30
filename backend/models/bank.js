'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bank extends Model {
    static associate(models) {
      Bank.belongsTo(models.PaymentMethod, {
        foreignKey: 'paymentMethodId',
        as: 'paymentMethod',
        onDelete: 'CASCADE',
      });
    }
  }
  Bank.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(36),
      allowNull: false
    },
    noRek: {
      type: DataTypes.STRING,
      allowNull: false
    },
    an: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    paymentMethodId: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Bank',
    tableName: 'banks',
    timestamps: true,
    paranoid: true // for deletedAt
  });
  return Bank;
};
