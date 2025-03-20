import LeaveRequestModel from "../models/leaveRequestModel.js";


const CreateAleave = async (req, res)=>{

    const{ name, section, leaveType, startDate,endDate,reason, userId} = req.body;

    try{
       
        const newLeave = await LeaveRequestModel({name, section, leaveType, startDate,endDate,reason, userId});

        await newLeave.save();
       
        res.json({success:true, message:"leave created successfully"});



    }catch(error)
    {
        console.log(error)
         res.json({success:false, message: error.message})
    }
}

const getRequestsByUserId = async(req,res)=>{
    try
    {
       const id = req.body.userId;
 
       const requests = await LeaveRequestModel.find({userId:id});
 
       if(!requests)
       {
          return res.json({success:false,message:'No requests'})
       }
       
       res.json({success:true,requests})

    }catch(err){

       console.log(err);
       res.json({success:false,message:err.message})
    }
 }

 const updateRequest = async(req,res)=>{
   try {
      const {id} = req.params;
      const {name, section, leaveType, startDate,endDate,reason} = req.body;


      const updatedRequest = await LeaveRequestModel.findByIdAndUpdate(id, {
       name, section, leaveType, startDate,endDate,reason
      }, { new: true });
  
      if (!updatedRequest) return res.status(404).json({ success: false, message: 'request not found' });
  
      res.json({ success: true, message: 'request updated successfully' });

    } catch (error) {

      res.json({ success: false, message: 'Error updating request' });
    }
}

const getRequestByRequestId = async(req,res)=>{
   try
   {
      const id = req.body.id;

      const request = await LeaveRequestModel.findOne({_id:id});

      if(!request)
      {
         return res.json({success:false,message:'No request found'})
      }
      
      res.json({success:true,request})

   }catch(err){

      console.log(err);
      res.json({success:false,message:err.message})
   }
}


const DeleteRequest = async(req,res)=>{
  try {
     const {id} = req.params;
  
     const deletedRequest = await LeaveRequestModel.findByIdAndDelete(id);
 
     if (!deletedRequest) return res.status(404).json({ success: false, message: 'request not found' });
 
     res.json({ success: true, message: 'request deleted successfully' });

   } catch (error) {

     res.json({ success: false, message: 'Error Deleting request' });
   }
}

const getAllRequests = async(req , res)=>
{
  try{

     const requests = await LeaveRequestModel.find();

     res.json({ success: true, requests });

  }catch(err)
  {
     console.log(err)
     res.json({ success: false, message:err.message });
  }
}

const updateLeavestatus = async(req,res)=>{
  try
  {
     const{id} = req.params;
    const{status} = req.body;

    const updatedRequest = await LeaveRequestModel.findByIdAndUpdate(id, { status }, { new: true });

      res.json({success:true,message:'updated'})

  }catch(err){

     console.log(err);
     res.json({success:false,message:'Error'})
  }
}

 export {CreateAleave,getRequestsByUserId,updateRequest,getRequestByRequestId, DeleteRequest,getAllRequests,updateLeavestatus}