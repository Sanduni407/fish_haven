import DeliveryModel from "../models/deliverModel.js";
import ExportOrderModel from "../models/exporterOrderModel.js";


const generateOrderCode = async () => {

    const lastOrder = await ExportOrderModel.findOne().sort({ _id: -1 }); 

    let newCode = "EXPO1001"; // Default if no orders exist
 
    if (lastOrder) {
        const lastCode = lastOrder.orderCode.replace("EXPO", ""); // Remove "EXPO"
        newCode = "EXPO" + (parseInt(lastCode) + 1); 
    }
 
    return newCode;
 };

 const CreateAOrder = async (req, res)=>{

    const{shippingAddress,shippingDate,orderType, contact,cart, userId} = req.body;

   
    if(!shippingAddress || !shippingDate || !orderType || !contact || !cart)
    {
        return res.json({success:false, message:"Missing Details"})
    }

    const orderCode = await generateOrderCode()

    try{
       
        const newOrder = await ExportOrderModel({shippingAddress,shippingDate,orderType,orderCode,contact,cart,userId});

        await newOrder.save();
       
        res.json({success:true, message:"Order placed successfully"});



    }catch(error)
    {
        console.log(error)
         res.json({success:false, message: error.message})
    }
}


const getAllOrdersById = async(req,res)=>{
    try
    {
       const id = req.body.userId;
 
       const orders = await ExportOrderModel.find({userId:id});
 
       if(!orders)
       {
          return res.json({success:false,message:'No orders'})
       }
       
       res.json({success:true,orders})

    }catch(err){

       console.log(err);
       res.json({success:false,message:err.message})
    }
 }


 const getAllOrders = async(req,res)=>{
    try
    {


        const{searchText} = req.query;

        const filter = searchText ?{$or:[
         {status:{$regex:searchText, $options:"i"}},
         {shippingDate:{$regex:searchText, $options:"i"}}
        ]}:{};
       
 
       const orders = await ExportOrderModel.find(filter);
 
       if(!orders)
       {
          return res.json({success:false,message:'No orders'})
       }
       
       res.json({success:true,orders})

    }catch(err){

       console.log(err);
       res.json({success:false,message:err.message})
    }
 }


 const getOrderByOrderId = async(req,res)=>{
    try
    {
       const Orderid = req.body.id;
 
       const order = await ExportOrderModel.findOne({_id:Orderid});
 
       if(!order)
       {
          return res.json({success:false,message:'No order found'})
       }
       
       res.json({success:true,order})
 
    }catch(err){
 
       console.log(err);
       res.json({success:false,message:err.message})
    }
 }


 const updateOrderstatus = async(req,res)=>{
   try
   {
      const{selectedRowId} = req.params;
     const{status} = req.body;

     if(!selectedRowId || !status)
     {
      return res.json({success:false , message:'required data is missing'})
     }

     const updatedOrder = await ExportOrderModel.findByIdAndUpdate(selectedRowId, { status }, { new: true });

       res.json({success:true,message:'updated'})

   }catch(err){

      console.log(err);
      res.json({success:false,message:'Error'})
   }
}


const deleteOrder = async(req,res)=>{
   try
   {
      const{selectedRowId} = req.params;

     if(!selectedRowId)
     {
      return res.json({success:false , message:'required data is missing'})
     }

         await ExportOrderModel.findByIdAndDelete(selectedRowId);

       res.json({success:true,message:'deleted'})

   }catch(err){

      console.log(err);
      res.json({success:false,message:'Error'})
   }
}


const updateOrder = async(req,res)=>{
   try {
      const {selectedRowId} = req.params;
      const {shippingAddress, shippingDate,  orderType,  contact,cart } = req.body;
  
      if(!selectedRowId || !shippingAddress || !shippingDate || !orderType || !contact || !cart)
         {
          return res.json({success:false , message:'required data is missing'})
         }


      const updatedOrder = await ExportOrderModel.findByIdAndUpdate(selectedRowId, {
         shippingAddress,
         shippingDate,
         orderType,
         contact,
         cart
      }, { new: true });

      const order = await ExportOrderModel.findOne({_id: selectedRowId })
      const orderCode = await order.orderCode;

      await DeliveryModel.findOneAndUpdate(
         { orderCode : orderCode }, 
         { shippingAddress, orderType,  contact},  
         { new: true } 
      );

    
  
      if (!updatedOrder) return res.status(404).json({ success: false, message: 'Order not found' });
  
      res.json({ success: true, message: 'Order updated successfully' });

    } catch (error) {

      res.json({ success: false, message: 'Error updating order' });
    }
}


const getOrderByOrderCode = async(req,res)=>{
   try
   {
      const orderCode = req.body.orderCode;

      const order = await ExportOrderModel.findOne({orderCode: orderCode});

      if(!order)
      {
         return res.json({success:false,message:'No order found'})
      }
      
      res.json({success:true,order})

   }catch(err){

      console.log(err);
      res.json({success:false,message:err.message})
   }
}


const fetchOrderSummary = async(req,res)=>{
   try{

      const orders = await ExportOrderModel.find();

      let pending = 0, confirmed = 0, rejected = 0;

      orders.forEach(order => {
         const status = order.status.toLowerCase();
         if (status === 'pending') pending++;
         else if (status === 'confirmed') confirmed++;
         else if (status === 'rejected') rejected++;
       });

       res.json({ success: true, pending, confirmed, rejected });

   }catch(err)
   {
      console.log(err);
      res.json({success:false,message:err.message})
   }
}


export{CreateAOrder, getAllOrdersById,getAllOrders,getOrderByOrderId, updateOrderstatus,deleteOrder,updateOrder,getOrderByOrderCode,fetchOrderSummary}