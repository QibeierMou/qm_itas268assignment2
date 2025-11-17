class User {
    constructor({ id, email, phoneNumber, password, role }) {
        this.id = id;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.password = password;
        this.role = role || 'student', 'teacher' , 'admin';
        this.verified = false;
        this.opt = null;
        this.optExpiry = null;
        this.createdAt = new Date();
    }
}

module.exports = User;