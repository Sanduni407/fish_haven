import express from 'express'
import { deleteUser, getAllUserAccounts, getuserDetailsById, loginUser, registerUser, resetPassword, sendResetOtp, updateUserById } from '../controllers/authController.js';
import userAuth from '../middleware/auth.js';

const authRouter = express.Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/send-reset-otp', sendResetOtp);
authRouter.post('/reset-password', resetPassword);
authRouter.get('/get', getAllUserAccounts);
authRouter.post('/get-user',userAuth,getuserDetailsById);
authRouter.put('/update-user/:id',updateUserById);
authRouter.delete('/delete-user/:id',deleteUser);


export default authRouter; 

