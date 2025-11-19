export default class Category {
    constructor({ id, name, isActive, createdAt, updatedAt, deletedAt, revision }) {
        this.id = id;
        this.name = name;
        this.isActive = isActive;
        this.createdAt = new Date(createdAt);
        this.updatedAt = new Date(updatedAt);
        this.deletedAt = deletedAt ? new Date(deletedAt) : null;
        this.revision = revision;
    }
}
