'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PaymentMethod extends Model {
    static associate(models) {
      PaymentMethod.hasMany(models.Bank, {
        foreignKey: 'paymentMethodId',
        as: 'banks',
        onDelete: 'CASCADE',
      });
    }
  }
  PaymentMethod.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(36),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'PaymentMethod',
    tableName: 'payment_methods',
    timestamps: true,
    paranoid: true // mendukung soft delete (deletedAt)
  });
  return PaymentMethod;
};
