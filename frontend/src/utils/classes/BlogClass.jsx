// models/Course.js

import formatDate from "../formatDate";

export default class Blog {
    constructor(data) {
        this.id = data.id;
        this.title = data.title;
        this.description = data.description;
        this.isFeatured = data.isFeatured;
        this.isPublish = data.isPublish;
        this.thumbnail = data.thumbnail;
        this.tags = data.tags;
        this.createdAt = new Date(data.createdAt);
        this.updatedAt = new Date(data.updatedAt);
        this.deletedAt = data.deletedAt ? new Date(data.deletedAt) : null;
        this.revision = data.revision;
    }

    get feature() {
        return this.isFeatured ? "Featured" : "Not Featured";
    }

    get publish() {
        return this.isPublish ? "Publish" : "Draft";
    }

    get formattedCreatedAt() {
        return formatDate(this.createdAt);
    }

    get formattedUpdatedAt() {
        return formatDate(this.updatedAt);
    }

    get formattedDeletedAt() {
        return this.deletedAt ? formatDate(this.deletedAt) : "";
    }
}
