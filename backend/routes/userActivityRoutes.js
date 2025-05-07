import express from 'express';
import { deleteAllUserActivities, getUserActivities } from '../controllers/userActivityController.js';
import userAuth from '../middleware/auth.js';

// NEW: Router for user activity endpoints
const userActivityRouter = express.Router();

// NEW: Route to fetch user activities (protected by userAuth middleware)
// Note: Only admin should access this, but role check is in frontend for now
userActivityRouter.get('/', userAuth, getUserActivities);


userActivityRouter.delete('/delete-all', deleteAllUserActivities);

export default userActivityRouter;