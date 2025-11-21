import express from 'express';
import{register,verifyOTP,login,verifyLoginOTP,resendOTP} from '../controllers/authController.js';

const routes = express.Router();

routes.post('/register', register);
routes.post('/verify-otp', verifyOTP);
routes.post('/login', login);
routes.post('/verify-login-otp', verifyLoginOTP);
routes.post('/resend-otp', resendOTP);

export default routes;