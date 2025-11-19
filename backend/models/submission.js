'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Submission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Submission.belongsTo(models.Assignment, {
        foreignKey: "assignmentId",
        as: "assignment"
      })
      Submission.belongsTo(models.Child, {
        foreignKey: "childId",
        as: "child"
      })
      Submission.belongsTo(models.User, {
        foreignKey: "studentId",
        as: "student"
      })
    }
  }
  Submission.init({
    id: {
      allowNull: false,
      unique: true,
      primaryKey: true,
      type: DataTypes.STRING(36),
      defaultValue: DataTypes.UUIDV4,
    },
    assignmentId: {
      type: DataTypes.STRING(36),
      references: {
        model: 'assignments',
        key: 'id'
      },
      onDelete: 'CASCADE',
      allowNull: false
    },
    studentId: {
      type: DataTypes.STRING(36),
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE',
      allowNull: true
    },
    childId: {
      type: DataTypes.STRING(36),
      references: {
        model: 'childrens',
        key: 'id'
      },
      onDelete: 'CASCADE',
      allowNull: true
    },
    fileUrl: {
      type: DataTypes.STRING
    },
    submittedAt: {
      type: DataTypes.DATE
    },
    grade: {
      type: DataTypes.FLOAT
    },
    feedback: {
      type: DataTypes.TEXT
    },
  }, {
    sequelize,
    modelName: 'Submission',
    tableName: 'submissions',
    paranoid: true,
    timestamps: true
  });
  return Submission;
};