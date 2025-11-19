'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Regency extends Model {
    static associate(models) {
      // Regency belongs to State
      Regency.belongsTo(models.Province, {
        foreignKey: 'province_id',
        as: 'province',
        onDelete: 'CASCADE',
      });
      Regency.hasMany(models.District, {
        foreignKey: 'regency_id',
        as: 'districts',
        onDelete: 'CASCADE',
      });
    }
  }
  Regency.init({
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    province_id: {
      type: DataTypes.BIGINT,
      references: {
        model: 'provinces',
        key: 'id'
      },
      onDelete: 'CASCADE',
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    sequelize,
    modelName: 'Regency',
    tableName: 'regencies',
    timestamps: true,
    paranoid: true // enable soft deletes (deletedAt)
  });
  return Regency;
};
