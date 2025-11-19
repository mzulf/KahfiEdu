import formatDate from "../formatDate";
import Payment from "./PaymentClass";
import Role from "./RoleClass";

export default class User {
    constructor({
        id,
        name,
        email,
        phone,
        gender,
        alamat,
        province,
        regency,
        district,
        village,
        avatar,
        roleId,
        role,
        emailVerified,
        googleId,
        createdAt,
        updatedAt,
        deletedAt,
        revision,
        payments
    }) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.gender = gender;
        this.alamat = alamat;
        this.province = province;
        this.regency = regency;
        this.district = district;
        this.village = village;
        this.avatar = avatar;
        this.roleId = roleId;
        this.role = role ? new Role(role) : null;
        this.emailVerified = emailVerified ? new Date(emailVerified) : null;
        this.googleId = googleId;
        this.payments = payments ? payments.map(p => new Payment(p)) : [];
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
    get formattedDeletedAt() {
        return formatDate(this.deletedAt);
    }
}