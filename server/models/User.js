class User {
    constructor({ id, email, phoneNumber, password, role }) {
        this.id = id;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.password = password;

        const allowedRoles = ['student', 'teacher', 'admin'];
        this.role = allowedRoles.includes(role) ? role : 'student';

        this.verified = false;
        this.otp = null;
        this.otpExpiry = null;
        this.createdAt = new Date();
    }
}

export default User;
