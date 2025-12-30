'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Village extends Model {
    static associate(models) {
      // Relasi ke District
      Village.belongsTo(models.District, {
        foreignKey: 'district_id',
        as: 'district',
      });
    }
  }

  Village.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      unique: true,
      primaryKey: true,
      type: DataTypes.BIGINT,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    district_id: {
      type: DataTypes.BIGINT,
      references: {
        model: 'districts',
        key: 'id',
      },
      onDelete: 'CASCADE',
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    sequelize,
    modelName: 'Village',
    tableName: 'villages',
    paranoid: true, // Untuk mendukung soft delete
    timestamps: true,
  });

  return Village;
};
