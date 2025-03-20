import mongoose from "mongoose"

const LeaveRequestSchema = new mongoose.Schema({
    
    userId:{ type:String, required:true},
    name :{type:String, required:true},
    leaveType:{type:String, required:true},
    section:{type:String, required:true},
    startDate:{type:String, required:true},
    endDate:{type:String,required:true},
    reason:{type:String},
    status:{type:String,default:'Pending'}

})

const LeaveRequestModel = mongoose.model.leave || mongoose.model("leave",LeaveRequestSchema);

export default LeaveRequestModel;