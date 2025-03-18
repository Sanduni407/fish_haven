import mongoose from "mongoose"

const connectDB = async () =>{
    await mongoose.connect('mongodb+srv://sandunidias:emp123456@cluster2.4l3mg.mongodb.net/fishhaven').then(()=>console.log("DB connected"));
}

export default connectDB;