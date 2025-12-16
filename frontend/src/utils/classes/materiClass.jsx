export default class Materi {
    constructor({
        id,
        title,
        description,
        detail,
        imageUrl,
        createdAt,
        updatedAt,
        deletedAt,
        revision,
    }) {
        // =============================
        // CORE DATA
        // =============================
        this.id = id;
        this.title = title;
        this.description = description;
        this.detail = detail;
        this.imageUrl = imageUrl;

        // =============================
        // DATE NORMALIZATION
        // =============================
        this.createdAt = createdAt ? new Date(createdAt) : null;
        this.updatedAt = updatedAt ? new Date(updatedAt) : null;
        this.deletedAt = deletedAt ? new Date(deletedAt) : null;

        // =============================
        // OPTIONAL / META
        // =============================
        this.revision = revision;
    }

    // =============================
    // DERIVED / HELPER PROPERTIES
    // =============================
    get isActive() {
        return !this.deletedAt;
    }

    get statusLabel() {
        return this.isActive ? "Aktif" : "Terhapus";
    }

    // =============================
    // SAFE FALLBACKS (FE USER)
    // =============================
    get safeImage() {
        return (
            this.imageUrl ||
            "/img/materi/sample1.jpg" // fallback default
        );
    }

    get safeDetail() {
        return this.detail || "Detail materi belum tersedia.";
    }

    get safeDescription() {
        return this.description || "-";
    }
}
