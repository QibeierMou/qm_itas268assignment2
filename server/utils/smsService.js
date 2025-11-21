// utils/sendSMSOTP.js
import twilio from "twilio";

export async function sendSMSOTP(phone, otp) {
    try {
        const client = twilio(
            process.env.TWILIO_SID,
            process.env.TWILIO_AUTH
        );

        await client.messages.create({
            from: process.env.TWILIO_PHONE,
            to: phone,
            body: `Your OTP code is: ${otp}`,
        });

        console.log("SMS OTP sent!");
    } catch (err) {
        console.log("SMS send error:", err);
    }
}
export default sendSMSOTP;
