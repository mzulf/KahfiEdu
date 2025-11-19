const { createQueue } = require("../../config/bullConfig");
const userImportProcessor = require("../processors/userImportProcessor");

// Create the queue with a clear name
const userImportQueue = createQueue("user-import");

// Register the processor function
userImportQueue.process(userImportProcessor);

module.exports = userImportQueue;