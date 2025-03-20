import express from 'express'
import { createDelivery,getAllDeliveries ,deleteDelivery ,fetchaDeliveryByDeliveryId,updateDelivery  } from '../controllers/deliveryController.js';

const deliveryRoute = express.Router();

deliveryRoute.post('/create-delivery',createDelivery);
deliveryRoute.get('/get-deliveries',getAllDeliveries );
deliveryRoute.delete('/delete-delivery/:selectedRowId',deleteDelivery );
deliveryRoute.get('/fetch-a-delivery/:id',fetchaDeliveryByDeliveryId );
deliveryRoute.put('/update-a-delivery/:id',updateDelivery );


export default deliveryRoute; 