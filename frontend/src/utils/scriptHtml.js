/**
 * Menghapus semua tag HTML dari string dan mengembalikan plain text
 * @param {string} html
 * @returns {string}
 */
export function stripHtml(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
}
