import mongoose from "mongoose"

const farmOrderSchema = new mongoose.Schema({
    
    orderCode:{type:String,required:true},
    userId:{type:String, required:true},
    size:{type:String, required:true},
    quantity:{type:Number, required:true },
    selectedCategory:{type:String, required:true},
    date:{type:String,required:true},
    selectedFarm:{type:String,required:true}

})

const FarmOrderModel = mongoose.model.farmorder || mongoose.model("farmorder",farmOrderSchema);

export default FarmOrderModel;