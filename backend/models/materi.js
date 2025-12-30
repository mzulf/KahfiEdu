'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Materi extends Model {}

    Materi.init({
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
        detail: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Materi',
        tableName: 'materi',
        timestamps: true,
        paranoid: true
    });

    return Materi;
};
