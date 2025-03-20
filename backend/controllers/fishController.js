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

export {addfish,getfishById,getallFish}