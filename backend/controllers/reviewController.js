import reviewModel from "../models/reviewModel.js";
import userModel from "../models/userModel.js";



const postReview = async (req, res) => {
    try {
      const { userId, review } = req.body;
  
      
      const user = await userModel.findById(userId);
  
      if (!user) {
        return res.json({ success: false, message: "User not found" });
      }
  
      
      const now = new Date();
      const date = now.toISOString().split("T")[0]; 
      const time = now.toTimeString().split(" ")[0].slice(0, 5); 
  
      
      const newReview = new reviewModel({
        userId,
        businessName: user.businessName,
        review,
        date,
        time
      });
  
      await newReview.save();
  
      res.json({ success: true, message: "Review posted successfully" });
  
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  };


  const getReviewsByUserId = async (req, res) => {
    try {
      const { userId } = req.body;
  
      const reviews = await reviewModel.find({ userId });
  
      if (!reviews || reviews.length === 0) {
        return res.json({ success: false, message: "No reviews found" });
      }
  
      res.json({ success: true, reviews });
  
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  };
  

  const getAllReviews = async (req, res) => {
    try {
      const reviews = await reviewModel.find();
  
      if (!reviews || reviews.length === 0) {
        return res.json({ success: false, message: "No reviews available" });
      }
  
      res.json({ success: true, reviews });
  
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  };
  
  
  const updateReview = async (req, res) => {
    try {
      const { id } = req.params; // review ID
      const { review } = req.body;
  
      const updatedReview = await reviewModel.findByIdAndUpdate(
        id,
        { review },
        { new: true }
      );
  
      if (!updatedReview) {
        return res.status(404).json({ success: false, message: "Review not found" });
      }
  
      res.json({ success: true, message: "Review updated successfully", updatedReview });
  
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  };


  const getReviewById = async (req, res) => {
    try {
      const { id } = req.params; // review ID
  
      const review = await reviewModel.findById(id);
  
      if (!review) {
        return res.status(404).json({ success: false, message: "Review not found" });
      }
  
      res.json({ success: true, review });
  
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  };
  

  const deleteReview = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedReview = await reviewModel.findByIdAndDelete(id);
  
      if (!deletedReview) {
        return res.status(404).json({ success: false, message: "Review not found" });
      }
  
      res.json({ success: true, message: "Review deleted successfully" });
  
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  };
  
  
  export { postReview ,getReviewsByUserId,getAllReviews,updateReview,getReviewById,deleteReview};