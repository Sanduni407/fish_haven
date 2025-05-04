import DeliveryModel from "../models/deliverModel.js";




const generateDeliveryCode = async () => {

    const lastDelivery = await DeliveryModel.findOne().sort({ _id: -1 }); 

    let newCode = "DEL10001"; // Default if no deliveries exist
 
    if (lastDelivery) {
        const lastCode = lastDelivery.delCode.replace("DEL", ""); // Remove "DEL"
        newCode = "DEL" + (parseInt(lastCode) + 1); 
    }
 
    return newCode;
 };

const createDelivery = async(req,res)=>{
    try{

        const{userId,orderCode, shippingAddress,deliveryDate, orderType,contact,PackagingArray} = req.body;

        const delCode = await generateDeliveryCode()

        const newDelivery = await DeliveryModel({userId,orderCode, shippingAddress,deliveryDate, orderType,contact,PackagingArray,delCode});

        await newDelivery.save();
       
        res.json({success:true, message:"Deliver placed successfully"});


    }catch(error)
    {
        console.log(error)
        res.json({success:false, message: error.message})
    }
}

const getAllDeliveries = async(req,res)=>{
    try
    {
       
      const{searchText} = req.query;

      const filter = searchText ?{$or:[
         {orderCode:{$regex:searchText, $options:"i"}},
         {deliveryDate:{$regex:searchText, $options:"i"}},
         {delCode:{$regex:searchText, $options:"i"}}
        ]}:{};
 
       const deliveries = await DeliveryModel.find(filter);
 
       if(!deliveries)
       {
          return res.json({success:false,message:'No deliveries'})
       }
       
       res.json({success:true,deliveries})

    }catch(err){

       console.log(err);
       res.json({success:false,message:err.message})
    }
 }


 const deleteDelivery = async(req,res)=>{
    try
    {
       const{selectedRowId} = req.params;
 
      if(!selectedRowId)
      {
       return res.json({success:false , message:'required data is missing'})
      }
 
          await DeliveryModel.findByIdAndDelete(selectedRowId);
 
        res.json({success:true,message:'deleted'})
 
    }catch(err){
 
       console.log(err);
       res.json({success:false,message:'Error'})
    }
 }

 const fetchaDeliveryByDeliveryId = async(req,res)=>{
   try{

      const{id} = req.params;

      const deliveryRecord = await DeliveryModel.findOne({_id:id});

      res.json({success:true, deliveryRecord })

   }catch(err)
   {
      console.log(err);
       res.json({success:false,message:'Error'})
   }
 }
 

 const updateDelivery = async(req,res)=>{
   try {
      const {id} = req.params;
      const {deliveryDate,PackagingArray} = req.body;
  
      if(!deliveryDate || !PackagingArray)
         {
          return res.json({success:false , message:'required data is missing'})
         }


      const updatedDelivery = await DeliveryModel.findByIdAndUpdate(id, {
         deliveryDate,
         PackagingArray
      }, { new: true });
  
      if (!updatedDelivery) return res.status(404).json({ success: false, message: 'delivery is not found' });
  
      res.json({ success: true, message: 'delivery updated successfully' });

    } catch (error) {

      res.json({ success: false, message: 'Error updating delivery' });
    }
}

export{createDelivery,getAllDeliveries,deleteDelivery,updateDelivery,fetchaDeliveryByDeliveryId}