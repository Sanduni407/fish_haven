
import express from 'express'
import userAuth from '../middleware/auth.js';
import multer from "multer"
import { addfish, getfishById, getallFish,getUniqueFishNames,deleteFish,updateFish,getfishByFishId} from '../controllers/fishController.js';

const fishRouter = express.Router();

//image storage engine

const storage = multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`)
    }
})


const upload = multer({storage:storage})

fishRouter.post('/create-fish',  upload.single('image') ,userAuth, addfish);

//fishRouter.post('/create-fish', userAuth,addfish)



fishRouter.post('/getfishById',userAuth,getfishById)
fishRouter.get('/getallFish',getallFish)
fishRouter.get('/get-fish-names',getUniqueFishNames)
fishRouter.delete('/delete-fish/:id',deleteFish)
fishRouter.put('/update-fish/:id',upload.single('image'), updateFish)
fishRouter.get('/get-fish-id/:id',getfishByFishId)

export default fishRouter;