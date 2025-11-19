'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ClassEnrollment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ClassEnrollment.belongsTo(models.User, {
        foreignKey: 'studentId',
        as: 'student',
        onDelete: 'CASCADE'
      })
      ClassEnrollment.belongsTo(models.Child, {
        foreignKey: 'childId',
        as: 'child',
        onDelete: 'CASCADE'
      })
      ClassEnrollment.belongsTo(models.Class, {
        foreignKey: 'classId',
        as: 'class',
        onDelete: 'CASCADE'
      })
    }
  }
  ClassEnrollment.init(
    {
      id: {
        allowNull: false,
        unique: true,
        primaryKey: true,
        type: DataTypes.STRING(36),
        defaultValue: DataTypes.UUIDV4,
      },
      classId: {
        type: DataTypes.STRING(36),
        references: {
          model: 'classes',
          key: 'id'
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      studentId: {
        type: DataTypes.STRING(36),
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        allowNull: true,
      },
      childId: {
        type: DataTypes.STRING(36),
        references: {
          model: 'childrens',
          key: 'id'
        },
        onDelete: 'CASCADE',
        allowNull: true,
      },
      progress: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      enrolledAt: {
        type: DataTypes.DATE
      },
      status: {
        type: DataTypes.ENUM('active', 'completed', 'pending'),
        defaultValue: 'pending',
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'ClassEnrollment',
      tableName: 'class_enrollments',
      paranoid: true, // enable soft delete (adds deletedAt)
      timestamps: true, // default true, but better to be explicit
    }
  );

  return ClassEnrollment;
};