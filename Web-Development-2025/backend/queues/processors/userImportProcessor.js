// queues/processors/userImportProcessor.js
const { parseExcel } = require("../../utils/excelParser");
const { User, Role } = require("../../models");
const { emitToClient } = require("../../config/socketConfig");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { validateEmail, validateRole } = require("../../utils/validorUtil");
const { sendProgressUpdate } = require("../../utils/socketUtil");
const jwt = require("jsonwebtoken")

/**
 * Process user import job
 * @param {Object} job - Bull job object containing job data
 * @returns {Promise<Object>} - Result of the import operation
 */
const userImportProcessor = async (job) => {
    const { filePath, token } = job.data;
    console.log("🔄 Processing job for token:", token);
    console.log("📥 Queue running for file:", filePath);

    // Validate file exists
    if (!fs.existsSync(filePath)) {
        console.error("❌ File not found:", filePath);
        notifyError(token, "File not found!");
        throw new Error("File not found!");
    }

    // Define expected headers
    const headers = [
        "name", "alamat", "province", "regency",
        "district", "village", "email", "emailVerified",
        "role", "gender", "phone", "password", "avatar"
    ];

    try {
        // Parse Excel file
        console.log("📊 Starting Excel parsing...");
        const data = await parseExcel(filePath, headers);
        console.log("✅ Excel parsed, total records:", data.length);

        // Load roles once to optimize database queries
        const rolesMap = await loadRoles();
        console.log("📋 Available roles:", Object.keys(rolesMap));

        // Initialize tracking arrays
        const processedUsers = [];
        const skippedUsers = [];

        // Send initial status update
        sendProgressUpdate(token, {
            total: data.length,
            processed: 0,
            skipped: 0,
            message: "Import started",
            skippedDetails: []
        });

        // Process in batches of 10 to provide regular updates
        const batchSize = 10;

        // Process each record
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            const index = i;

            try {
                // Validate and process user
                const result = await processUserRecord(item, index, rolesMap);

                if (result.success) {
                    processedUsers.push(result.email);
                } else {
                    skippedUsers.push({
                        index: index + 1,
                        email: item.email || 'Unknown',
                        reason: result.reason
                    });
                }
            } catch (error) {
                console.error(`❌ Error on record #${index + 1}:`, error.message);
                skippedUsers.push({
                    index: index + 1,
                    email: item.email || 'Unknown',
                    reason: error.message
                });
            }

            // Send progress update after each batch or on last item
            if ((i + 1) % batchSize === 0 || i === data.length - 1) {
                sendProgressUpdate(token, {
                    total: data.length,
                    processed: processedUsers.length,
                    skipped: skippedUsers.length,
                    skippedDetails: skippedUsers.slice(0, 5), // Only send first 5 for efficiency
                    progress: Math.round(((processedUsers.length + skippedUsers.length) / data.length) * 100)
                });
            }
        }

        // Log completion
        console.log("✅ Import completed:");
        console.log(`   ✓ ${processedUsers.length} records successfully saved`);
        console.log(`   ✗ ${skippedUsers.length} records skipped`);

        // Send final status update
        console.log("📡 Sending final status to client with socket ID:", token);
        sendProgressUpdate(token, {
            total: data.length,
            processed: processedUsers.length,
            skipped: skippedUsers.length,
            skippedDetails: skippedUsers.slice(0, 20), // Send more details in final report
            progress: 100,
            completed: true,
            message: "Import completed"
        });

        return {
            success: true,
            message: "Import completed",
            total: data.length,
            processed: processedUsers.length,
            skipped: skippedUsers.length
        };
    } catch (error) {
        console.error("❌ Failed to import data:", error.message);
        notifyError(token, "Failed to import data: " + error.message);
        throw new Error("Error during data import: " + error.message);
    }
};

/**
 * Load all roles from database and create a lookup map
 * @returns {Promise<Object>} - Map of role names to role IDs
 */
async function loadRoles() {
    const roles = await Role.findAll();
    const rolesMap = {};
    roles.forEach(role => {
        rolesMap[role.name.toLowerCase()] = role.id;
    });
    return rolesMap;
}

/**
 * Process a single user record
 * @param {Object} item - User data from Excel
 * @param {Number} index - Index of the record
 * @param {Object} rolesMap - Map of role names to role IDs
 * @returns {Promise<Object>} - Result of processing
 */
async function processUserRecord(item, index, rolesMap) {
    try {

        // Validate email format
        if (!validateEmail(item.email)) {
            console.warn(`⚠️ Record #${index + 1} skipped: invalid email ->`, item.email);
            return {
                success: false,
                reason: 'Invalid email',
                email: item.email
            };
        }

        // Check for email uniqueness - add transaction
        const existingUser = await User.findOne({
            where: { email: item.email }
        });
        if (existingUser) {
            console.warn(`⚠️ Record #${index + 1} skipped: email already exists ->`, item.email);
            return {
                success: false,
                reason: 'Email already exists',
                email: item.email
            };
        }

        // Get role ID
        const roleResult = validateRole(item.role, rolesMap);
        if (!roleResult.success) {
            console.warn(`⚠️ ${roleResult.message}`);
            return {
                success: false,
                reason: roleResult.message,
                email: item.email
            };
        }

        const plainPassword = String(item.password);
        console.log(plainPassword);
        if (!plainPassword) {
            console.error(`❌ Failed password for record #${index + 1}`);
            return {
                success: false,
                reason: 'Failed password',
                email: item.email
            };
        }
        // Prepare user data
        const userData = {
            id: uuidv4(),
            name: item.name,
            alamat: item.alamat,
            province: item.province,
            regency: item.regency,
            district: item.district,
            village: item.village,
            email: item.email,
            emailVerified: item.emailVerified ? new Date(item.emailVerified) : null,
            roleId: roleResult.roleId,
            gender: item.gender,
            phone: item.phone,
            password: plainPassword,
            avatar: typeof item.avatar === "string" ? item.avatar : null
        };

        console.log(`🔄 Processing record #${index + 1}`);

        // Create user with transaction
        await User.create(userData);

        return { success: true, email: userData.email };

    } catch (error) {
        console.error(`❌ Error processing record #${index + 1}:`, error);
        return {
            success: false,
            reason: error.message,
            email: item.email
        };
    }
}


/**
 * Send error notification to client
 * @param {String} socketId - Socket ID to send notification to
 * @param {String} message - Error message
 */
function notifyError(token, message) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const clientId = decoded.userId || decoded.id;
    if (clientId) {
        emitToClient(clientId, "importProgress", {
            error: true,
            message
        });
    }
}

module.exports = userImportProcessor;