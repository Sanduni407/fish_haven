import mongoose from "mongoose"

const AsignVehicleSchema = new mongoose.Schema({
    
    userId:{ type:String, required:true}, 
    delCode:{type:String,required:true},
    vehicle:{type:String, required:true},
    date:{type:String, required:true},
    time:{type:String, required:true},
    status:{type:String,default:'Assigned'}

})

const AssignVehicleModel = mongoose.model.vehicle || mongoose.model("vehicle",AsignVehicleSchema);

export default AssignVehicleModel;