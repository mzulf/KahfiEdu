export default class Role {
    constructor({
        id,
        name,
        createdAt,
        updatedAt,
        deletedAt,
        revision
    }) {
        this.id = id;
        this.name = name;
        this.createdAt = createdAt ? new Date(createdAt) : null;
        this.updatedAt = updatedAt ? new Date(updatedAt) : null;
        this.deletedAt = deletedAt ? new Date(deletedAt) : null;
        this.revision = revision;
    }

    get fullAddress() {
        return [this.alamat, this.village, this.district, this.regency, this.province]
            .filter(Boolean)
            .join(', ');
    }

    get formattedCreatedAt() {
        return formatDate(this.createdAt);
    }

    get formattedUpdatedAt() {
        return formatDate(this.updatedAt);
    }
}