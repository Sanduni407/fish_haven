import FarmOrderModel from "../models/farmOrderModel.js";
import fishModel from "../models/fishModel.js";
import userModel from "../models/userModel.js";



const placeafarmOrder = async(req,res)=>{

    const{orderCode,selectedCategory,selectedFarm,size,quantity,date,userId} = req.body;

    
    try{

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

const getTheFarmByCategory = async (req, res) => {
    try {
        const { selectedCategory } = req.body;

        // Find the fish category
        const fishcategory = await fishModel.findOne({ fishCategory: selectedCategory });

        if (!fishcategory) {
            return res.json({ success: false, message: "Fish category not found" });
        }

        const userId = await fishcategory.userId;
        // Find the user (farm owner) by userId
        const user = await userModel.findOne({ _id: userId });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ success: true ,user });

    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

const deleteFarmOrder = async(req,res)=>{
    try
    {
       const{id} = req.params;
 
      if(!id)
      {
       return res.json({success:false , message:'required data is missing'})
      }
 
          await FarmOrderModel.findByIdAndDelete(id);
 
        res.json({success:true,message:'deleted'})
 
    }catch(err){
 
       console.log(err);
       res.json({success:false,message:'Error'})
    }
 }

const getOrdersByUserId = async(req,res)=>{

    const {userId} = req.body;

    try{

        const orders = await FarmOrderModel.find({userId:userId});

        res.json({success:true,orders })

    }catch(err)
    {
        console.log(err)
        res.json({success:false, message:'request has been failed'})
    }
}


const updateFramOrder = async(req,res)=>
    {
         const{id} = req.params;
         const{orderCode,selectedCategory,selectedFarm,size,quantity, date} = req.body;
    
         try
         {
           const updatedOrder = await FarmOrderModel.findByIdAndUpdate(id,{orderCode,selectedCategory,selectedFarm,size,quantity, date},{new:true});
    
           if(!updatedOrder )
           {
            return res.json({success:false, message:'order can not find'});
           }
    
           res.json({success:true, message:'order Updated successfully'})
         }
         catch(err)
         {
            console.log(err)
            res.json({success:false , message:'farm order can not be updated'})
         }
    }
    
    const getThefarmOrderByOrderId = async(req,res)=>{
    
        const{id} = req.body;
        try
        {
          const Order = await FarmOrderModel.findOne({_id:id})
    
          if(!Order)
          {
           return res.json({success:false, message:'order can not find'});
          }
    
          res.json({success:true, Order})
        }
        catch(err)
        {
           console.log(err)
           res.json({success:false , message:'Error'})
        }
    }

export {placeafarmOrder,getAllFarmOrders,getTheFarmByCategory,getOrdersByUserId,deleteFarmOrder,updateFramOrder,getThefarmOrderByOrderId}