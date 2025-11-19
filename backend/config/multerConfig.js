// config/multerConfig.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

/**
 * Fungsi untuk membuat konfigurasi penyimpanan dengan path dan filename dinamis.
 * @param {string} destinationPath - Lokasi direktori untuk menyimpan file.
 * @param {string} fileNamePrefix - Prefix untuk nama file, bisa menggunakan timestamp atau lainnya.
 * @returns {multer.StorageEngine} - Konfigurasi penyimpanan untuk multer.
 */
function createStorage(destinationPath, fileNamePrefix = "") {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            // Cek dan buat folder jika belum ada
            if (!fs.existsSync(destinationPath)) {
                fs.mkdirSync(destinationPath, { recursive: true });
            }
            cb(null, destinationPath);
        },
        filename: (req, file, cb) => {
            const randomStr = crypto.randomBytes(3).toString("hex"); // 6 karakter hex
            const ext = path.extname(file.originalname); // ambil ekstensi asli
            const fileName = `${Date.now()}-${randomStr}${ext}`;
            cb(null, fileName);
        }
    });
}

/**
 * Fungsi untuk membuat filter file berdasarkan mimetype yang diizinkan.
 * @param {Array} allowedMimes - Daftar mimetype yang diizinkan untuk upload.
 * @returns {Function} - Fungsi filter untuk multer.
 */
function createFileFilter(allowedMimes) {
    return (req, file, cb) => {
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true); // Jika mimetype diizinkan
        } else {
            cb(new Error("File tidak diizinkan"), false); // Jika tidak sesuai
        }
    };
}

/**
 * Fungsi utama untuk membuat konfigurasi multer upload.
 * @param {string} destinationPath - Lokasi untuk menyimpan file.
 * @param {Array} allowedMimes - Mimetype file yang diizinkan.
 * @param {string} fileNamePrefix - Prefix nama file (opsional).
 * @returns {multer.Instance} - Instance multer dengan konfigurasi yang disesuaikan.
 */
function createUpload(destinationPath, allowedMimes, fileNamePrefix = "") {
    const storage = createStorage(destinationPath, fileNamePrefix);
    const fileFilter = createFileFilter(allowedMimes);

    return multer({ storage, fileFilter });
}

module.exports = { createUpload };
