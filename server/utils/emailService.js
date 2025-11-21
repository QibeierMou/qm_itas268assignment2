import nodemailer from "nodemailer";

export async function sendEmailOTP(email, otp) {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP code is: ${otp}`
        });

        console.log("Email OTP sent!");
    } catch (err) {
        console.log("Email send error:", err);
    }
}

export default sendEmailOTP;
