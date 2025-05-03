import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  businessName: { type: String, required: true },
  review: { type: String, required: true },
  date: { type: String, required: true }, 
  time: { type: String, required: true }  
});

const reviewModel = mongoose.models.review || mongoose.model("review", reviewSchema);

export default reviewModel;