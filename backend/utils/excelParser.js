// utils/excelParser.js

const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");

/**
 * Parse Excel or CSV file into array of objects
 * @param {string} filePath - Path to the file
 * @param {string[]} headers - Expected headers
 * @returns {Promise<Object[]>}
 */
async function parseExcel(filePath, headers) {
    const ext = path.extname(filePath).toLowerCase();
    const workbook = new ExcelJS.Workbook();
    const data = [];

    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }

    if (ext === '.csv') {
        await workbook.csv.readFile(filePath);
    } else if (ext === '.xlsx' || ext === '.xls') {
        await workbook.xlsx.readFile(filePath);
    } else {
        throw new Error(`Unsupported file extension: ${ext}`);
    }

    const worksheet = workbook.worksheets[0];

    if (!worksheet) {
        throw new Error('No worksheet found in file.');
    }

    worksheet.eachRow((row, rowNumber) => {
        // Skip the header row
        if (rowNumber === 1) return;

        const rowData = {};
        headers.forEach((header, index) => {
            const cell = row.getCell(index + 1);
            rowData[header] = cell?.value ?? null;
        });

        data.push(rowData);
    });

    return data;
}

module.exports = { parseExcel };

module.exports = { parseExcel };
