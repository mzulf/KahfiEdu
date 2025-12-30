'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RevisionChange extends Model {
    static associate(models) {
      // Asosiasi dengan model 'Revision'
      RevisionChange.belongsTo(models.Revision, {
        foreignKey: 'revisionId',
        as: 'revision',
        onDelete: 'CASCADE',
      });
    }
  }

  RevisionChange.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    revisionId: {
      type: DataTypes.UUID,
      references: {
        model: 'Revisions', // Mengacu pada model 'Revisions'
        key: 'id',
      },
      onDelete: 'CASCADE',
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    document: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    diff: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'RevisionChange',
    timestamps: true,
    paranoid: true,
    tableName: 'revisionchanges', // Nama tabel di database
  });

  return RevisionChange;
};
