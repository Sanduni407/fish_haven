import exporterRegistrationModel from "../models/exporterModel.js";


//user make a request to register as a exporter
const createRegisterRequest = async (req, res)=>{

    const{name,businessName,businessRegNo,address,email,phone} = req.body;

    // check these fields have the values
    if(!name || !email || !address || !phone || !businessName || !businessRegNo)
    {
        return res.json({success:false, message:"Missing Details"})
    }


    try{
       

        const newRequest = new exporterRegistrationModel({name,businessName,businessRegNo,address,email,phone});

        await newRequest.save();


        res.json({success:true, message:"registration request submitted successfully"});



    }catch(error)
    {
        console.log(error)
         res.json({success:false, message: error.message})
    }
}

//get the all exorter requests
const getallRequest= async(req,res)=>{
    try{
       
            const requests = await exporterRegistrationModel.find();

            res.json({success:true,requests});

    }catch(err)
    {
        console.log(err)
        res.json({success:false,message:'Error'})
    }
}

//to fetch data to the form
const getARequestById = async(req,res)=>{
    try {
   const {id} = req.params;
   const request = await exporterRegistrationModel.findById({_id:id}); // Assuming a MongoDB database
  if (!request) return res.status(404).json({ success: false, message: 'request not found' });

  res.json({ success: true, request });
} catch (error) {
  res.status(500).json({ success: false, message: 'Error fetching request' });
}
}



const deleteRegisterRequest = async(req,res)=>{

     try
        {
           const{id} = req.params;
     
          if(!id)
          {
           return res.json({success:false , message:'required data is missing'})
          }
     
              await exporterRegistrationModel.findByIdAndDelete(id);
     
            res.json({success:true,message:'deleted'})
     
        }catch(err){
     
           console.log(err);
           res.json({success:false,message:'Error'})
        }

}


export {createRegisterRequest,getallRequest,getARequestById,deleteRegisterRequest}