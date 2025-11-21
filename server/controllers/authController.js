import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import generateOTP from '../utils/optService.js';
import sendSMSOTP from '../utils/smsService.js';
import sendEmailOTP from '../utils/emailService.js';

const __dirname = path.resolve();
const dbPath = path.join(__dirname, 'users.json');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRE = "24h";

// --- Helper functions ---

function readUsers() {
  if (!fs.existsSync(dbPath)) return { users: [] };
  const data = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
  // Ensure users is an array
  if (!Array.isArray(data.users)) data.users = [];
  return data;
}

function writeUsers(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// --- Part 1: Register ---

export function register(req, res) {
  const { email, phoneNumber, password, role, otpMethod } = req.body;

  if (!email || !phoneNumber || !password || !role || !otpMethod) {
    return res.status(400).json({ success: false, message: "All fields required" });
  }

  const data = readUsers();
  const users = data.users;

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ success: false, message: "User already exists" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const otp = generateOTP();
  const otpExpiry = Date.now() + 5 * 60 * 1000;
  const userId = Date.now().toString();

  users.push({
    userId,
    email,
    phoneNumber,
    password: hashedPassword,
    role,
    otpMethod,
    otp,
    otpExpiry,
    verified: false
  });

  writeUsers(data);

  if (otpMethod === "sms") sendSMSOTP(phoneNumber, otp);
  if (otpMethod === "email") sendEmailOTP(email, otp);

  return res.json({
    success: true,
    message: `Registration successful. OTP sent via ${otpMethod}`,
    userId
  });
}

// --- Part 2: Verify Registration OTP ---

export function verifyOTP(req, res) {
  const { userId, otp } = req.body;

  const data = readUsers();
  const user = data.users.find(u => u.userId === userId);

  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  if (user.verified) return res.status(400).json({ success: false, message: "Already verified" });
  if (user.otp !== otp) return res.status(400).json({ success: false, message: "Invalid OTP" });
  if (Date.now() > user.otpExpiry) return res.status(400).json({ success: false, message: "OTP expired" });

  user.verified = true;
  user.otp = null;
  user.otpExpiry = null;

  writeUsers(data);

  return res.json({ success: true, message: "Account verified" });
}

// --- Part 3: Login ---

export function login(req, res) {
  const { email, password, otpMethod } = req.body;

  const data = readUsers();
  const user = data.users.find(u => u.email === email);

  if (!user) return res.status(404).json({ message: "User not found" });
  if (!bcrypt.compareSync(password, user.password))
    return res.status(400).json({ message: "Wrong password" });
  if (!user.verified)
    return res.status(400).json({ message: "Account not verified" });

  const otp = generateOTP();
  user.otp = otp;
  user.otpMethod = otpMethod;
  user.otpExpiry = Date.now() + 5 * 60 * 1000;

  writeUsers(data);

  if (otpMethod === "sms") sendSMSOTP(user.phoneNumber, otp);
  if (otpMethod === "email") sendEmailOTP(user.email, otp);

  return res.json({ success: true, message: "OTP sent", userId: user.userId });
}

// --- Part 4: Verify Login OTP ---

export function verifyLoginOTP(req, res) {
  const { userId, otp } = req.body;

  const data = readUsers();
  const user = data.users.find(u => u.userId === userId);

  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
  if (Date.now() > user.otpExpiry) return res.status(400).json({ message: "OTP expired" });

  user.otp = null;
  user.otpExpiry = null;
  writeUsers(data);

  const token = jwt.sign(
    { id: user.userId, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );

  return res.json({ success: true, message: "Login success", token });
}

// --- Part 5: Resend OTP ---

export function resendOTP(req, res) {
  const { userId, otpMethod } = req.body;

  const data = readUsers();
  const user = data.users.find(u => u.userId === userId);

  if (!user) return res.status(404).json({ message: "User not found" });

  const newOTP = generateOTP();
  user.otp = newOTP;
  user.otpMethod = otpMethod;
  user.otpExpiry = Date.now() + 5 * 60 * 1000;

  writeUsers(data);

  if (otpMethod === "sms") sendSMSOTP(user.phoneNumber, newOTP);
  if (otpMethod === "email") sendEmailOTP(user.email, newOTP);

  return res.json({ success: true, message: "OTP resent" });
}
