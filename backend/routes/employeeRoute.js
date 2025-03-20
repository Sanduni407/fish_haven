import express from 'express'
import userAuth from '../middleware/auth.js';
import { CreateAleave, getRequestsByUserId } from '../controllers/leaveController.js';


const employeeRouter = express.Router();

employeeRouter.post('/create-leave',userAuth,CreateAleave);
employeeRouter.post('/get-requests-byuser',userAuth, getRequestsByUserId);

export default employeeRouter; 