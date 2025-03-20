import mongoose from "mongoose"

const fishSchema = new mongoose.Schema({
    
    userId:{type:String, required:true},
    fishCategory:{type:String, required:true},
    gender:{type:String, required:true},
    size:{type:String, required:true },
    unitPrice:{type:Number, required:true},
    quantity:{type:Number, required:true}
    //add a image also
})

const fishModel = mongoose.model.fish || mongoose.model("fish",fishSchema);

export default fishModel;