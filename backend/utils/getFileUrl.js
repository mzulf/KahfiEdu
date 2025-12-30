/**
 * Menghasilkan full URL dari file upload berdasarkan request dan filename.
 * @param {object} req - Request Express (harus mengandung req.file).
 * @param {string} filename - Nama file yang diupload.
 * @returns {string} - Full URL file, contoh: http://localhost:3000/uploads/filename.jpg
 */
function getFileUrl(req, filename) {
    if (!req || !filename) return null;

    const protocol = req.protocol;
    const host = req.get("host"); // Contoh: localhost:3000
    return `${protocol}://${host}/uploads/${filename}`;
}

module.exports = getFileUrl;