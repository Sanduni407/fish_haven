import express from 'express'
import userAuth from '../middleware/auth.js';
import { CreateAleave, getRequestsByUserId,updateRequest,getRequestByRequestId,DeleteRequest,getAllRequests,updateLeavestatus } from '../controllers/leaveController.js';


const employeeRouter = express.Router();

employeeRouter.post('/create-leave',userAuth,CreateAleave);
employeeRouter.post('/get-requests-byuser',userAuth, getRequestsByUserId);
employeeRouter.put('/update-request/:id',updateRequest);
employeeRouter.post('/fetch-a-request',getRequestByRequestId);
employeeRouter.delete('/delete-a-request/:id',DeleteRequest);
employeeRouter.get('/get-all-requests',getAllRequests);
employeeRouter.put('/update-status/:id',updateLeavestatus);

export default employeeRouter; 