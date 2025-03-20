import express from 'express'
import { CreateAOrder } from '../controllers/exportOrderController.js';
import userAuth from '../middleware/auth.js';

const orderRouter = express.Router();

orderRouter.post('/create-order',userAuth, CreateAOrder);

export default orderRouter; 