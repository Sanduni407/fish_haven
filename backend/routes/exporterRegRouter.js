import express from 'express'
import { createRegisterRequest, getallRequest, getARequestById } from '../controllers/exporterRegController.js';


const requestRouter = express.Router();

requestRouter.post('/create-request', createRegisterRequest);
requestRouter.get('/get-all-requests', getallRequest);
requestRouter.get('/get-a-request/:id', getARequestById);


export default requestRouter; 

