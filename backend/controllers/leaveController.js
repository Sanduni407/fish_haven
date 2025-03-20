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

 export {CreateAleave,getRequestsByUserId}