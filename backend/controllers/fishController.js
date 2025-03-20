import fishModel from "../models/fishModel.js";



const addfish = async(req,res)=>{
    try{

        const createFish = new fishModel(req.body);

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
       
            const allfish = await fishModel.find();

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

const updateFish = async(req,res)=>{

    const {id} = req.params; // extract unique fish id
    const {fishCategory, gender, size, unitPrice,quantity } = req.body;

    try{
          const updatefish = await fishModel.findByIdAndUpdate(id, {
            fishCategory, gender, size, unitPrice,quantity }, { new: true });
            
      if (!updatefish) return res.status(404).json({ success: false, message: 'Fish not found' });

      res.json({ success: true, message: 'Fish updated successfully' });

    }catch(err)
    {
        console.log(err)

        res.json({ success: false, message: err.message });
    }
  

}


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
 
          await fishModel.findByIdAndDelete(id);
 
        res.json({success:true,message:'deleted'})
 
    }catch(err){
 
       console.log(err);
       res.json({success:false,message:'Error'})
    }
 }

export {addfish,getfishById,getallFish,getUniqueFishNames,updateFish,deleteFish,getfishByFishId}