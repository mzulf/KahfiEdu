'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Payment extends Model {
        static associate(models) {
            Payment.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'fromUser',
                onDelete: 'CASCADE',
            });
            Payment.belongsTo(models.User, {
                foreignKey: 'confirmation_by',
                as: 'confirmedBy',
                onDelete: 'CASCADE',
            });
            Payment.belongsTo(models.Child, {
                foreignKey: 'childId',
                as: 'child',
                onDelete: 'CASCADE',
            });
            Payment.belongsTo(models.Class, {
                foreignKey: 'classId',
                as: 'forClass',
                onDelete: 'CASCADE',
            });
        }
    }
    Payment.init({
        id: {
            allowNull: false,
            unique: true,
            primaryKey: true,
            type: DataTypes.STRING(36),
            defaultValue: DataTypes.UUIDV4
        },
        userId: {
            type: DataTypes.STRING(36),
            onDelete: 'CASCADE',
            allowNull: false
        },
        childId: {
            type: DataTypes.STRING(36),
            onDelete: 'CASCADE',
            allowNull: true
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
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        noRef: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("pending", "completed", "failed"),
            defaultValue: "pending",
            allowNull: false
        },
        method_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        bank_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        no_rekening: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        atas_nama: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        payment_proof: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        payment_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        confirmation_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        confirmation_by: {
            type: DataTypes.UUID,
            references: {
                model: 'users',
                key: 'id'
            },
            onDelete: 'CASCADE',
            allowNull: true
        },
    }, {
        sequelize,
        modelName: 'Payment',
        tableName: 'payments',
        timestamps: true,
        paranoid: true
    });
    return Payment;
};
