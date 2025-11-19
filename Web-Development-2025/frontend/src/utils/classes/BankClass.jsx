import formatDate from "../formatDate";

export default class Bank {
    constructor({
        id,
        name,
        noRek,
        an,
        isActive,
        paymentMethodId,
        createdAt,
        updatedAt,
        deletedAt,
        revision,
    }) {
        this.id = id;
        this.name = name;
        this.noRek = noRek;
        this.an = an;
        this.isActive = isActive;
        this.paymentMethodId = paymentMethodId;
        this.createdAt = new Date(createdAt);
        this.updatedAt = new Date(updatedAt);
        this.deletedAt = deletedAt ? new Date(deletedAt) : null;
        this.revision = revision;
    }

    get status() {
        return this.isActive ? "Aktif" : "Tidak Aktif"
    }

    get formattedCreatedAt() {
        return formatDate(this.createdAt);
    }

    get formattedUpdatedAt() {
        return formatDate(this.updatedAt);
    }
    get formattedDeletedAt() {
        return formatDate(this.deletedAt);
    }
}