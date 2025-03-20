import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
   
    name: {type:String, required: true},
    businessName:{type:String,default:'' },
    businessRegNo:{type:String, default:''},
    address: { type: String , required: true },
    email: {type:String, required: true, unique: true},
    phone:{type:String, required:true},
    role:{type:String, required:true},
    password: {type : String , required: true},
    resetOtp:{type:String, default:''},
    resetOtpExpireAt:{type:Number, default:0}


})

const userModel = mongoose.models.user || mongoose.model('user',userSchema);

export default userModel;