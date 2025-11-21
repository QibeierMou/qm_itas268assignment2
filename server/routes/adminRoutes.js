import express from "express";
import { auth, checkRole } from "../middleware/authmiddleware.js";

const router = express.Router();

router.get('/dashboard', auth, checkRole(['admin']), (req, res) => {
    return res.json({
        success: true,
        data: {
            message: 'Welcome to the admin dashboard',
            user: req.user.email,
            role: req.user.role,
            stats: {
                totalUsers: 150,
                totalStudents: 120,
                totalTeachers: 29,
                totalAdmins: 1
            }
        }
    });
});

export default router;
