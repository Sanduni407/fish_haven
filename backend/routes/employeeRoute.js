import express from 'express'
import userAuth from '../middleware/auth.js';
import { CreateAleave, getRequestsByUserId,updateRequest,getRequestByRequestId,DeleteRequest,getAllRequests,updateLeavestatus } from '../controllers/leaveController.js';
import { deleteReview, getAllReviews, getReviewById, getReviewsByUserId, postReview, updateReview } from '../controllers/reviewController.js';


const employeeRouter = express.Router();

employeeRouter.post('/create-leave',userAuth,CreateAleave); //leavecontroller
employeeRouter.post('/get-requests-byuser',userAuth, getRequestsByUserId);
employeeRouter.put('/update-request/:id',updateRequest);
employeeRouter.post('/fetch-a-request',getRequestByRequestId);
employeeRouter.delete('/delete-a-request/:id',DeleteRequest);
employeeRouter.get('/get-all-requests',getAllRequests);
employeeRouter.put('/update-status/:id',updateLeavestatus);



// review route

employeeRouter.post('/create-review',userAuth,postReview)
employeeRouter.post("/review-by-userid", userAuth,getReviewsByUserId)
employeeRouter.get("/get-all-reviews",getAllReviews)
employeeRouter.put("/update-review/:id",updateReview)
employeeRouter.get("/get-review-by-id/:id",getReviewById)
employeeRouter.delete("/delete-review/:id",deleteReview)

export default employeeRouter;