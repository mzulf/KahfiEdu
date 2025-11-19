'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    static associate(models) {
      Attendance.belongsTo(models.Class, {
        foreignKey: 'classId',
        as: 'class',
        onDelete: 'CASCADE',
      });

      Attendance.belongsTo(models.Lesson, {
        foreignKey: 'lessonId',
        as: 'lesson',
        onDelete: 'CASCADE',
      });

      Attendance.belongsTo(models.User, {
        foreignKey: 'studentId',
        as: 'student',
        onDelete: 'CASCADE',
      });
      Attendance.belongsTo(models.User, {
        foreignKey: 'teacherId',
        as: 'teacher',
        onDelete: 'CASCADE',
      });

      Attendance.belongsTo(models.Child, {
        foreignKey: 'childId',
        as: 'child',
        onDelete: 'CASCADE',
      });
    }
  }

  Attendance.init({
    id: {
      allowNull: false,
      unique: true,
      primaryKey: true,
      type: DataTypes.STRING(36),
      defaultValue: DataTypes.UUIDV4,
    },
    classId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lessonId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    childId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    teacherId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    scanTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('hadir', 'izin', 'sakit', 'alfa'),
      defaultValue: 'hadir',
      allowNull: false,
    },
    excuseLetter: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Attendance',
    paranoid: true, // mengaktifkan soft delete
    tableName: 'attendances',
  });

  return Attendance;
};
