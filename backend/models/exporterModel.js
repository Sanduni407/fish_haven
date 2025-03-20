import mongoose from 'mongoose'

const exporterSchema= new mongoose.Schema({
   
    name: {type:String, required: true},
    businessName:{type:String, required:true},
    businessRegNo:{type:String, required:true},
    address: { type: String , required: true },
    email: {type:String, required: true, unique: true},
    phone:{type:String, required:true},

})

const exporterRegistrationModel = mongoose.models.exporter || mongoose.model('exporter',exporterSchema);

export default exporterRegistrationModel;