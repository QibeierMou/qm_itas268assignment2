import express from 'express';
import { auth, checkRole } from '../middleware/authmiddleware.js';

const routes = express.Router();

routes.get('/teacher/dashboard', auth, checkRole(['admin','teacher']), (req, res) => {
    return res.json({
        success: true,
        data : {
            "message": 'Welcome to the teacher dashboard',
            "user": "user_email",
            "role": "teacher",
            "classes": ["Math 101 - Section A","Math 101 - Section B"],
            "totalStudents": 45
        }
    });
});
export default routes;