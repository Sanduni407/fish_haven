import AssignVehicleModel from "../models/asignVehicleModel.js";
import DeliveryModel from "../models/deliverModel.js";



const assignVehicle = async(req , res)=>{
    try{

        const {userId,delCode, vehicle, date, time } = req.body;

        const newDelivery = new AssignVehicleModel({
            userId,delCode, vehicle, date, time
          });
           
          await newDelivery.save();
          res.status(201).json({ success: true ,message: "Vehicle assigned successfully", newDelivery });

    }catch(error)
    {
        console.log(error)
        res.json({success:false, message: error.message})
    }
}

const getAllVehicle = async(req , res)=>{
    try{

         const assignVehicles = await AssignVehicleModel.find();
           
          res.status(201).json({ success: true , assignVehicles });

    }catch(error)
    {
        console.log(error)
        res.json({success:false, message: error.message})
    }
}


const filterAssignedVehicles = async(req , res)=>{
    try {

        const { date } = req.params;
    
        const assignedVehicles = await AssignVehicleModel.find({ date }).distinct("vehicle");

        const vehicles = ["CXX-2316", "DBR-2456", "CAA-1516", "KA-2342", "CAZ-1003"];
    
        const availableVehicles = vehicles.filter(v => !assignedVehicles.includes(v));
    
        res.json(availableVehicles);

      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}

const updateAssignedVehicle = async(req,res)=>{
    try
    {
       const{id} = req.params;
      const{status,time, vehicle} = req.body;
 
      const updatedDelivery = await AssignVehicleModel.findByIdAndUpdate(id, {status,time,vehicle}, { new: true });
 
        res.json({success:true,message:'updated'})
 
    }catch(err){
 
       console.log(err);
       res.json({success:false,message:'Error'})
    }
 }
 

 const getVehicleById = async(req , res)=>{
    try{

        const{id} = req.params;
  
        const vehicleRecode = await AssignVehicleModel.findOne({_id:id});
  
        res.json({success:true, vehicleRecode })
  
     }catch(err)
     {
        console.log(err);
         res.json({success:false,message:'Error'})
     }
 }

 const deleteVehicle = async(req,res) =>{
    try
    {
       const{id} = req.params;

          await AssignVehicleModel.findByIdAndDelete(id);
 
        res.json({success:true,message:'deleted'})
 
    }catch(err){
 
       console.log(err);
       res.json({success:false,message:'Error'})
    }
 }


export {assignVehicle,getAllVehicle,filterAssignedVehicles,updateAssignedVehicle,getVehicleById,deleteVehicle }