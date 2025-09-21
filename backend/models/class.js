'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Class extends Model {
    static associate(models) {
      // Class belongs to Course
      Class.belongsTo(models.Course, {
        foreignKey: 'courseId',
        as: 'course',
        onDelete: 'CASCADE'
      });

      // Class belongs to User (as Teacher)
      Class.belongsTo(models.User, {
        foreignKey: 'teacherId',
        as: 'teacher',
        onDelete: 'CASCADE'
      });
      Class.hasMany(models.ClassEnrollment, {
        foreignKey: 'classId',
        as: 'class_enrollments',
        onDelete: 'CASCADE'
      });
      Class.hasMany(models.Assignment, {
        foreignKey: 'classId',
        as: 'assignments',
        onDelete: 'CASCADE'
      });
      Class.hasMany(models.Lesson, {
        foreignKey: 'classId',
        as: 'lessons',
        onDelete: 'CASCADE'
      });
    }
  }

  Class.init({
    id: {
      type: DataTypes.STRING(36),
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    teacherId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING
    },
    schedule: {
      type: DataTypes.TEXT
    },
    startDate: {
      type: DataTypes.DATE
    },
    endDate: {
      type: DataTypes.DATE
    },
    status: {
      type: DataTypes.ENUM("akan datang", "berjalan", "selesai"),
      defaultValue: "akan datang"
    },
    progress: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    deletedAt: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Class',
    tableName: 'classes',
    timestamps: true,
    paranoid: true,
  });

  return Class;
};
