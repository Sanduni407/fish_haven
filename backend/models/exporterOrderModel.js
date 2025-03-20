import mongoose from "mongoose"

const ExporterOrderSchema = new mongoose.Schema({
    
    userId:{ type:String, required:true},
    orderCode:{type:String,unique:true},
    shippingAddress:{type:String, required:true},
    shippingDate:{type:String, required:true},
    orderType:{type:String, required:true},
    contact:{type:String, required:true, unique:true },
    cart:{type:Array,required:true},
    status:{type:String,default:'Pending'}

})

const ExportOrderModel = mongoose.model.exportorder || mongoose.model("exportorder",ExporterOrderSchema);

export default ExportOrderModel;