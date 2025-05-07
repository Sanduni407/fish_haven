import express from 'express'
import { createRegisterRequest, deleteRegisterRequest, getallRequest, getARequestById } from '../controllers/exporterRegController.js';


const requestRouter = express.Router();

requestRouter.post('/create-request', createRegisterRequest);
requestRouter.get('/get-all-requests', getallRequest);
requestRouter.get('/get-a-request/:id', getARequestById);
requestRouter.delete('/delete-a-request/:id',deleteRegisterRequest);


export default requestRouter; 

