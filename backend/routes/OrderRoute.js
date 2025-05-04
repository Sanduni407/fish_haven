import express from 'express'
import { CreateAOrder ,getAllOrdersById ,getAllOrders,getOrderByOrderId,updateOrderstatus,deleteOrder,updateOrder,getOrderByOrderCode, fetchOrderSummary} from '../controllers/exportOrderController.js';
import userAuth from '../middleware/auth.js';
import {  getAllFarmOrders, placeafarmOrder ,getTheFarmByCategory,getOrdersByUserId,deleteFarmOrder,updateFramOrder,getThefarmOrderByOrderId} from '../controllers/farmOrderController.js';

const orderRouter = express.Router();

orderRouter.post('/create-order',userAuth, CreateAOrder);
orderRouter.post('/get-orders-byuser',userAuth, getAllOrdersById);
orderRouter.get('/get-orders',getAllOrders );
orderRouter.post('/get-order',getOrderByOrderId);
orderRouter.put('/update-status/:selectedRowId',updateOrderstatus);
orderRouter.delete('/delete-order/:selectedRowId',deleteOrder);
orderRouter.put('/update-order/:selectedRowId',updateOrder);
orderRouter.post('/get-order-by-ordercode',getOrderByOrderCode);
orderRouter.get('/fetch-summary',fetchOrderSummary);


orderRouter.post('/place-farm-order',placeafarmOrder);
orderRouter.get('/get-all-farm-order',getAllFarmOrders);
orderRouter.post('/get-the-farm',getTheFarmByCategory);
orderRouter.post('/get-farm-Orders-byuser',userAuth,getOrdersByUserId);
orderRouter.delete('/delete-farm-order/:id', deleteFarmOrder);
orderRouter.put('/update-farm-order/:id', updateFramOrder);
orderRouter.post('/get-farm-order-byorderid', getThefarmOrderByOrderId);


export default orderRouter; 