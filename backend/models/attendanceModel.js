import mongoose from "mongoose"

const attendanceSchema = new mongoose.Schema({
    
    empId:{ type:String, required:true},
    status:{type:String,required:true},
    date:{type:String, required:true}

})

const attendanceModel = mongoose.model.attendance || mongoose.model("attendance",attendanceSchema);

export default attendanceModel;