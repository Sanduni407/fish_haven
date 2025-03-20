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


export{createDelivery}