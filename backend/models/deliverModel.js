import mongoose from "mongoose"

const DeliverySchema = new mongoose.Schema({
    
    userId:{ type:String, required:true},
    orderCode:{type:String,required:true},
    shippingAddress:{type:String, required:true},
    deliveryDate:{type:String, required:true},
    orderType:{type:String, required:true},
    contact:{type:String, required:true },
    PackagingArray:{type:Array,default:'send later'},
    delCode:{type:String,required:true},
    Deliverystatus:{type:String,default:'Pending'}

})

const DeliveryModel = mongoose.model.delivery || mongoose.model("delivery",DeliverySchema);

export default DeliveryModel;