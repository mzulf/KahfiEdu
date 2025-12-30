// models/Course.js

import formatDate from "../formatDate";
import Class from "./Class";
import User from "./UserClass";

export default class Payment {
    constructor(data) {
        this.id = data.id;
        this.userId = data.userId;
        this.childId = data.childId;
        this.classId = data.classId;
        this.amount = data.amount;
        this.noRef = data.noRef;
        this.status = data.status;
        this.method_name = data.method_name;
        this.bank_name = data.bank_name;
        this.no_rekening = data.no_rekening;
        this.atas_nama = data.atas_nama;
        this.payment_proof = data.payment_proof;
        this.confirmation_by = data.confirmation_by;
        this.confirmation_by = data.confirmation_by;
        this.payment_date = new Date(data.payment_date);
        this.createdAt = new Date(data.createdAt);
        this.updatedAt = new Date(data.updatedAt);
        this.deletedAt = data.deletedAt ? new Date(data.deletedAt) : null;
        this.fromUser = data.fromUser ? new User(data.fromUser) : null;
        this.forClass = data.forClass ? new Class(data.forClass) : null;
        this.child = data.child ? {
            id: data.child.id,
            name: data.child.name
        } : null;
        this.confirmedBy = data.confirmedBy ? {
            id: data.confirmedBy.id,
            name: data.confirmedBy.name
        } : null;
        this.availableUsers = data.availableUsers ? data.availableUsers.map(user => ({
            id: user.id,
            name: user.name
        })) : [];
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
