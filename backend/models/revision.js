'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Revision extends Model {
    static associate(models) {
      // Association with the tracked model is handled in models/index.js
      Revision.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
        onDelete: 'CASCADE',
      });

      Revision.hasMany(models.RevisionChange, {
        foreignKey: 'revisionId',
        as: 'RevisionChanges',
        onDelete: 'CASCADE',
      });
    }
  }

  Revision.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    document: {
      type: DataTypes.TEXT, // Gunakan JSON, bukan JSONB di MariaDB
      allowNull: false
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Name of the changed model, such as Role or User',
    },
    documentId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'ID of the changed model entity',
    },
    operation: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Change action, such as "create", "update", "delete"',
    },
    revision: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Revision number of the change',
    },
    userId: {
      type: DataTypes.STRING(36),
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'SET NULL'
    }
  }, {
    sequelize,
    modelName: 'Revision',
    timestamps: true,
    paranoid: true,
    tableName: 'revisions',

  });


  return Revision;
};