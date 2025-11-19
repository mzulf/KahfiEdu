'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class District extends Model {
    static associate(models) {
      // Relasi ke Regency
      District.belongsTo(models.Regency, {
        foreignKey: 'regency_id',
        as: 'regency'
      });
      District.hasMany(models.Village, {
        foreignKey: 'district_id',
        as: 'villages'
      });
    }
  }

  District.init({
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      unique: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    regency_id: {
      type: DataTypes.BIGINT,
      references: {
        model: 'regencies',
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
    modelName: 'District',
    tableName: 'districts',
    paranoid: true, // Untuk mendukung soft delete (deletedAt)
    timestamps: true,
  });

  return District;
};
