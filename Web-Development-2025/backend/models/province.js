'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Province extends Model {
    static associate(models) {
      // Province hasMany City
      Province.hasMany(models.Regency, {
        foreignKey: 'province_id',
        as: 'regencies',
        onDelete: 'CASCADE',
      });
    }
  }
  Province.init({
    id: {
      allowNull: false,
      unique: true,
      primaryKey: true,
      type: DataTypes.BIGINT,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    sequelize,
    modelName: 'Province',
    tableName: 'provinces',
    timestamps: true,
    paranoid: true // enable soft deletes
  });
  return Province;
};
