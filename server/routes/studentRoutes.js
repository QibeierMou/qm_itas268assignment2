import express from 'express';
import { auth, checkRole } from '../middleware/authmiddleware.js';

const routes = express.Router();

routes.get('/student/dashboard', auth, checkRole(['student','teacher','admin']), (req, res) => {
    return res.json({
        success: true,
        data : {
            "message": 'Welcome to the student dashboard',
            "user": "user_email",
            "role": "student",
            "classes": ["Math 101 - Section A","History 201 - Section B"]
        }
    });
});
export default routes;