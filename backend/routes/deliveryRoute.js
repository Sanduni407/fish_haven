import express from 'express'
import { createDelivery } from '../controllers/deliveryController.js';

const deliveryRoute = express.Router();

deliveryRoute.post('/create-delivery',createDelivery);


export default deliveryRoute; 