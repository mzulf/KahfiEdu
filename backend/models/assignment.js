'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Assignment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Assignment.belongsTo(models.Class, {
        foreignKey: "classId",
        as: "class"
      })
    }
  }
  Assignment.init({
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
      allowNull: false
    },
    title: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.TEXT
    },
    dueDate: {
      type: DataTypes.DATE
    },
  }, {
    sequelize,
    modelName: 'Assignment',
    tableName: 'assignments',
    paranoid: true,
    timestamps: true,
  });
  return Assignment;
};