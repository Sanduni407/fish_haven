import express from 'express'
import { registerUser , loginUser, resetPassword, sendResetOtp,getAllUserAccounts } from '../controllers/authController.js';

const authRouter = express.Router()

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/send-reset-otp', sendResetOtp);
authRouter.post('/reset-password', resetPassword);
authRouter.get('/get', getAllUserAccounts);








export default authRouter; 