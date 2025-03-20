import express from 'express'
import { CreateAOrder ,getAllOrdersById ,getAllOrders,getOrderByOrderId} from '../controllers/exportOrderController.js';
import userAuth from '../middleware/auth.js';

const orderRouter = express.Router();

orderRouter.post('/create-order',userAuth, CreateAOrder);
orderRouter.post('/get-orders-byuser',userAuth, getAllOrdersById);
orderRouter.get('/get-orders',getAllOrders );
orderRouter.post('/get-order',getOrderByOrderId);

export default orderRouter; 