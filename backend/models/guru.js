'use strict';

module.exports = (sequelize, DataTypes) => {
  const Guru = sequelize.define('Guru', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nama: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Nama guru wajib diisi'
        }
      }
    },
    nomorTelepon: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Nomor telepon wajib diisi'
        }
      }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: {
        msg: 'Email sudah terdaftar'
      },
      validate: {
        isEmail: {
          msg: 'Email tidak valid'
        }
      }
    },
    foto: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      defaultValue: null
    }
  }, {
    tableName: 'guru',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Guru.associate = (models) => {
    // contoh relasi nanti di sini
    // Guru.hasMany(models.Siswa)
  };

  return Guru;
};