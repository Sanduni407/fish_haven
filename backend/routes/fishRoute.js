
import express from 'express'
import userAuth from '../middleware/auth.js';
import { addfish, getfishById, getallFish} from '../controllers/fishController.js';

const fishRouter = express.Router();

fishRouter.post('/create-fish', userAuth,addfish)
fishRouter.post('/getfishById',userAuth,getfishById)
fishRouter.get('/getallFish',getallFish)

export default fishRouter;