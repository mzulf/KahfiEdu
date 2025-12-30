'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      Course.belongsTo(models.Category, {
        foreignKey: 'categoryId',
        as: 'category',
        onDelete: 'CASCADE'
      });
      Course.hasMany(models.Class, {
        foreignKey: 'courseId',
        as: 'classes',
        onDelete: 'CASCADE'
      });

    }
  }
  Course.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    level: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    isPublish: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Course',
    tableName: 'courses',
    timestamps: true,
    paranoid: true
  });
  return Course;
};
