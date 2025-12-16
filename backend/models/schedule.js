"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    static associate(models) {
      Schedule.hasMany(models.Attendance, { foreignKey: "scheduleId" });
      Schedule.belongsTo(models.User, { foreignKey: "teacherId", as: "teacher" });
    }
  }

  Schedule.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      guru: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      qrValue: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Schedule",
      tableName: "schedules",
      paranoid: true,
    }
  );

  return Schedule;
};
