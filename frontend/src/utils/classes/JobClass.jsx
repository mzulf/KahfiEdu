// models/Course.js

import formatDate from "../formatDate";

export default class Job {
    constructor(data) {
        this.id = data.id;
        this.title = data.title;
        this.description = data.description;
        this.position = data.position;
        this.location = data.location;
        this.urlLink = data.urlLink;
        this.employmentType = data.employmentType;
        this.createdAt = new Date(data.createdAt);
        this.updatedAt = new Date(data.updatedAt);
        this.deletedAt = data.deletedAt ? new Date(data.deletedAt) : null;
        this.revision = data.revision;
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
