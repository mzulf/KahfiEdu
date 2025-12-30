'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lesson extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Lesson.belongsTo(models.Class, {
        foreignKey: 'classId',
        as: 'class',
      })
    }
  }
  Lesson.init({
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
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    videoUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    code: {
      type: DataTypes.STRING(6),
      allowNull: true,
      unique: true,
    },
  }, {
    sequelize,
    modelName: 'Lesson',
    tableName: 'lessons',
    paranoid: true,
    timestamps: true,
    hooks: {
      beforeCreate: async (lesson, options) => {
        // Fungsi generate kode acak
        const generateCode = () => {
          const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
          let result = '';
          for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
          }
          return result;
        };

        // Cek agar kode unik (opsional)
        let unique = false;
        while (!unique) {
          const newCode = generateCode();
          const existing = await sequelize.models.Lesson.findOne({ where: { code: newCode } });
          if (!existing) {
            lesson.code = newCode;
            unique = true;
          }
        }
      }
    }
  });
  return Lesson;
};