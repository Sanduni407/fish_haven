import fishModel from "../models/fishModel.js";
import fs from 'fs'


//add fish
const addfish = async(req,res)=>{
    try{

        let image_filename = `${req.file.filename}`;

        const createFish = new fishModel({
            userId: req.body.userId,
            fishCategory: req.body.fishCategory,
            gender: req.body.gender,
            size: req.body.size,
            unitPrice: req.body.unitPrice,
            quantity: req.body.quantity,
            image:image_filename
        })


        // const createFish = new fishModel(req.body);

        await createFish.save();

        res.json({success:true,message:'fish is saved'})

    }catch(err){
       
        console.log(err);
        res.json({success:false,message:'Error'})
    }
}

const getfishById = async(req,res)=>{ // get fish by user id

    try{
       
            const fishes = await fishModel.find({userId:req.body.userId});

            res.json({success:true,fishes});

    }catch(err)
    {
        console.log(err)
        res.json({success:false,message:'Error'})
    }
}

const getallFish= async(req,res)=>{
    try{

        const{searchText} = req.query;

        const filter = searchText ?{$or:[
         {fishCategory:{$regex:searchText, $options:"i"}}
        ]}:{};
       
            const allfish = await fishModel.find(filter);

            res.json({success:true,allfish});

    }catch(err)
    {
        console.log(err)
        res.json({success:false,message:'Error'})
    }
}


const getUniqueFishNames = async (req, res) => {
    try {
        const uniqueFishNames = await fishModel.distinct("fishCategory");
        res.json({ success: true, uniqueFishNames });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error fetching fish names" });
    }
};







const updateFish = async (req, res) => {
    const { id } = req.params;

    try {
        const fish = await fishModel.findById(id);
        if (!fish) return res.status(404).json({ success: false, message: 'Fish not found' });

        let updatedData = {
            fishCategory: req.body.fishCategory,
            gender: req.body.gender,
            size: req.body.size,
            unitPrice: req.body.unitPrice,
            quantity: req.body.quantity
        };

        // Check if new image uploaded
        if (req.file) {
            // Delete old image
            const oldImagePath = `uploads/${fish.image}`;
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }

            // Set new image filename
            updatedData.image = req.file.filename;
        }

        await fishModel.findByIdAndUpdate(id, updatedData, { new: true });

        res.json({ success: true, message: 'Fish updated successfully' });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: err.message });
    }
};




const getfishByFishId = async(req,res)=>{ // get fish by user id

    try{
        
            const {id} = req.params
            const fish = await fishModel.findOne({_id:id});

            res.json({success:true,fish});

    }catch(err)
    {
        console.log(err)
        res.json({success:false,message:'Error'})
    }
}






 const deleteFish= async(req,res)=>{
    try
    {
       const{id} = req.params;
 
      if(!id)
      {
       return res.json({success:false , message:'required data is missing'})
      }


      const fish = await fishModel.findById(id)
      
      fs.unlink(`uploads/${fish.image}`,()=>{})


      await fishModel.findByIdAndDelete(id);
 
        res.json({success:true,message:'deleted'})
 
    }catch(err){
 
       console.log(err);
       res.json({success:false,message:'Error'})
    }
 }

export {addfish,getfishById,getallFish,getUniqueFishNames,updateFish,deleteFish,getfishByFishId}