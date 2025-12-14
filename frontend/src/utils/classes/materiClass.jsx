export default class Materi {
    constructor({
        id,
        title,
        description,
        createdAt,
        updatedAt,
        deletedAt,
        revision,
    }) {
        this.id = id;
        this.title = title;
        this.description = description;

        // date normalization
        this.createdAt = createdAt ? new Date(createdAt) : null;
        this.updatedAt = updatedAt ? new Date(updatedAt) : null;
        this.deletedAt = deletedAt ? new Date(deletedAt) : null;

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
}
