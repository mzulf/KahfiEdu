'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Job extends Model {
        static associate(models) {
            // Define associations here if needed
            // For example, if you have a User model and want to associate it with Job
            // Job.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
        }
    }
    Job.init({
        id: {
            allowNull: false,
            unique: true,
            primaryKey: true,
            type: DataTypes.STRING(36),
            defaultValue: DataTypes.UUIDV4,
        },
        title: {
            type: DataTypes.STRING(36),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        position: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        urlLink: {
            allowNull: true,
            type: DataTypes.STRING,
        },
        location: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        employmentType: {
            type: DataTypes.ENUM("full-time", "part-time", "contract", "internship"),
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'Job',
        tableName: 'jobs',
        timestamps: true,
        paranoid: true // for deletedAt
    });
    return Job;
};
