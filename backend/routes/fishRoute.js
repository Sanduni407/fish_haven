
import express from 'express'
import userAuth from '../middleware/auth.js';
import { addfish, getfishById, getallFish,getUniqueFishNames,deleteFish,updateFish,getfishByFishId} from '../controllers/fishController.js';

const fishRouter = express.Router();

fishRouter.post('/create-fish', userAuth,addfish)
fishRouter.post('/getfishById',userAuth,getfishById)
fishRouter.get('/getallFish',getallFish)
fishRouter.get('/get-fish-names',getUniqueFishNames)
fishRouter.delete('/delete-fish/:id',deleteFish)
fishRouter.put('/update-fish/:id',updateFish)
fishRouter.get('/get-fish-id/:id',getfishByFishId)

export default fishRouter;