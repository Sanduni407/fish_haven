import FarmOrderModel from "../models/farmOrderModel.js";
import fishModel from "../models/fishModel.js";
import userModel from "../models/userModel.js";



const placeafarmOrder = async(req,res)=>{

    const{orderCode,selectedCategory,selectedFarm,size,quantity,date} = req.body;

    
    try{

        const user = await userModel.findOne({businessName:selectedFarm});
        
        const userId = user._id;

        const newFramOrder = new FarmOrderModel({orderCode,selectedCategory,selectedFarm,size,quantity,date,userId});
        
        await newFramOrder.save();

        res.json({success:true, message:"farmer order is successfully created"})

    }
    catch(err)
    {
        res.json({success:false, message:err.message})
    }
}


const getAllFarmOrders = async(req,res)=>{

    try{
        
        const farmOrders = await FarmOrderModel.find();

        res.json({success:true, farmOrders})

    }
    catch(err)
    {
        res.json({success:false, message:err.message})
    }
}

export {placeafarmOrder,getAllFarmOrders}