const { Guru } = require('../models'); // ✅ FIX UTAMA
const { Op } = require('sequelize');

// Get all guru
exports.getAllGuru = async (req, res) => {
   
  try {
    const { page = 1, limit = 5, search = '' } = req.query;
    const offset = (page - 1) * limit;
    console.log("🔥 GET GURU DIPANGGIL");

    const whereClause = search
      ? { nama: { [Op.like]: `%${search}%` } }
      : {};

    const { count, rows } = await Guru.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data guru',
      error: error.message
    });
  }
};

// Get guru by ID
exports.getGuruById = async (req, res) => {
  try {
    const guru = await Guru.findByPk(req.params.id);

    if (!guru) {
      return res.status(404).json({
        success: false,
        message: 'Guru tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      data: guru
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data guru',
      error: error.message
    });
  }
};

// Create guru
exports.createGuru = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);

    const { nama, nomorTelepon, email, foto } = req.body;

    const guru = await Guru.create({
      nama,
      nomorTelepon,
      email,
      foto
    });

    res.status(201).json({
      success: true,
      message: 'Guru berhasil ditambahkan',
      data: guru
    });
  } catch (error) {
    console.error("CREATE GURU ERROR:", error);

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Email sudah terdaftar'
      });
    }

    res.status(400).json({
      success: false,
      message: 'Gagal menambahkan guru',
      error: error.message
    });
  }
};

// Update guru
exports.updateGuru = async (req, res) => {
  try {
    const { nama, nomorTelepon, email, foto } = req.body;

    const guru = await Guru.findByPk(req.params.id);

    if (!guru) {
      return res.status(404).json({
        success: false,
        message: 'Guru tidak ditemukan'
      });
    }

    await guru.update({
      nama,
      nomorTelepon,
      email,
      foto
    });

    res.status(200).json({
      success: true,
      message: 'Data guru berhasil diupdate',
      data: guru
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Gagal mengupdate data guru',
      error: error.message
    });
  }
};

// Delete guru
exports.deleteGuru = async (req, res) => {
  try {
    const guru = await Guru.findByPk(req.params.id);

    if (!guru) {
      return res.status(404).json({
        success: false,
        message: 'Guru tidak ditemukan'
      });
    }

    await guru.destroy();

    res.status(200).json({
      success: true,
      message: 'Guru berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus guru',
      error: error.message
    });
  }
};