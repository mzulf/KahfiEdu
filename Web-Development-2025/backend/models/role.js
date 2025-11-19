'use strict';
const { Model } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      // contoh relasi jika diperlukan nanti, misalnya:
      Role.hasMany(models.User, { foreignKey: 'roleId', as: 'users', onDelete: 'CASCADE', });
    }
  }

  Role.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Role',
    timestamps: true,
    paranoid: true,
  });


  return Role;
};
