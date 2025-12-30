// utils/badgeUtils.js

const badgeConfig = {
    course: (item) => {
        if (item.deletedAt) {
            return [{ label: "Deleted", color: "#B71C1C" }];
        }

        const badges = [];

        if (item.isPublish) {
            badges.push({ label: "Publish", color: "#008B47" });
        }

        if (item.isFeatured) {
            badges.push({ label: "Featured", color: "#FFA000" });
        }

        return badges;
    },

    blog: (item) => {
        if (item.deletedAt) {
            return [{ label: "Deleted", color: "#B71C1C" }];
        }

        const badges = [];

        if (item.isFeatured) {
            badges.push({ label: "Di Fiturkan", color: "#FFA000" });
        }

        if (item.isPublish) {
            badges.push({ label: "Di Publish", color: "#1976D2" });
        }


        return badges;
    },

    // Tambahkan konfigurasi lain (misal: event, product, user, dsb)
};

/**
 * Fungsi utama untuk mendapatkan badge berdasarkan tipe entitas
 * @param {string} type - tipe data, contoh: 'course', 'blog'
 * @param {object} item - data object yang ingin dimapping
 * @returns {Array<{label: string, color: string}>}
 */
export function getBadges(type, item) {
    if (!badgeConfig[type]) return [];
    return badgeConfig[type](item);
}
