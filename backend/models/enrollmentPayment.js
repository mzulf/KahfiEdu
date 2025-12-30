'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class EnrollmentPayment extends Model {
        static associate(models) {
            // EnrollmentPayment belongs to Course
        }
    }

    EnrollmentPayment.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        enrollmentId: {
            type: DataTypes.STRING(36),
            allowNull: false,
            references: {
                model: 'class_enrollments', // sesuaikan dengan nama tabel enrollments Anda
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        paymentId: {
            type: DataTypes.STRING(36),
            allowNull: false,
            references: {
                model: 'payments',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
    }, {
        sequelize,
        modelName: 'EnrollmentPayment',
        tableName: 'enrollment_payment',
        timestamps: true,
        paranoid: true,
    });

    return EnrollmentPayment;
};
