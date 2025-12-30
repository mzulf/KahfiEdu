'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Children extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Children.belongsTo(models.User, {
        foreignKey: 'parentId',
        as: 'parent',
        onDelete: 'CASCADE',
      });
      Children.hasMany(models.ClassEnrollment, {
        foreignKey: 'childId',
        as: 'classEnrollments',
        onDelete: 'CASCADE',
      });
    }
  }
  Children.init({
    id: {
      allowNull: false,
      unique: true,
      primaryKey: true,
      type: DataTypes.STRING(36),
      defaultValue: DataTypes.UUIDV4,
    },
    parentId: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE',
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM('laki-laki', 'perempuan'),
      defaultValue: null,
      allowNull: true,

    },
    relationship: {
      type: DataTypes.ENUM('anak', 'keponakan', 'cucu'),
      defaultValue: null,
      allowNull: true,
    },
  },
    {
      sequelize,
      modelName: 'Child',
      tableName: 'childrens',
      paranoid: true, // enable soft delete (adds deletedAt)
      timestamps: true, // default true, but better to be explicit
    }
  );
  return Children;
};