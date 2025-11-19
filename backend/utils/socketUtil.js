const { emitToClient } = require("../config/socketConfig");
const jwt = require("jsonwebtoken")

/**
 * Send progress update to client
 * @param {String} clientId - Socket ID to send update to
 * @param {Object} data - Status data to send
 */
function sendProgressUpdate(token, data) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const clientId = decoded.userId || decoded.id;
        if (clientId) {
            emitToClient(clientId, "importStatus", data);
        } else {
            console.warn("⚠️ No userId in token payload");
        }
    } catch (err) {
        console.error("❌ Invalid token in sendProgressUpdate:", err.message);
    }
}

module.exports = {
    sendProgressUpdate
};