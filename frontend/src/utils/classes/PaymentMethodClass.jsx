import formatDate from '../formatDate';
import Bank from './BankClass';

export default class PaymentMethod {
    constructor({
        id,
        name,
        description,
        createdAt,
        updatedAt,
        deletedAt,
        revision,
        banks = [],
    }) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.createdAt = new Date(createdAt);
        this.updatedAt = new Date(updatedAt);
        this.deletedAt = deletedAt ? new Date(deletedAt) : null;
        this.revision = revision;
        this.banks = banks.map(bank => new Bank(bank));
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
