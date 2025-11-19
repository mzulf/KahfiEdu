// models/Course.js

import formatDate from "../formatDate";
import Category from "./CategoryClass";
import Class from "./Class";

export default class Course {
    constructor(data) {
        this.id = data.id;
        this.title = data.title;
        this.description = data.description;
        this.categoryId = data.categoryId;
        this.level = data.level;
        this.isFeatured = data.isFeatured;
        this.isPublish = data.isPublish;
        this.thumbnail = data.thumbnail;
        this.createdAt = new Date(data.createdAt);
        this.updatedAt = new Date(data.updatedAt);
        this.deletedAt = data.deletedAt ? new Date(data.deletedAt) : null;
        this.revision = data.revision;
        this.category = data.category ? new Category(data.category) : null;
        this.classes = data.classes ? data.classes.map(c => new Class(c)) : [];
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
