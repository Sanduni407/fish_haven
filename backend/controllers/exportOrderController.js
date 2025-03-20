//import DeliveryModel from "../models/deliverModel.js";
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


export{CreateAOrder}