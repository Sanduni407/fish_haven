import UserActivity from '../models/userActivityModel.js';
import User from '../models/userModel.js'; // NEW: Import User model to lookup by email

export const getUserActivities = async (req, res) => {
  try {
    const { email, action, startDate, endDate } = req.query; // UPDATED: Changed userId to email
    const query = {};

    // NEW: If email is provided, find the user and filter by their userId
    if (email) {
      const user = await User.findOne({ email: email.trim().toLowerCase() });
      if (user) {
        query.userId = user._id;
      } else {
        // If no user is found with the email, return empty results
        return res.status(200).json({ success: true, activities: [] });
      }
    }

    if (action) query.action = action;
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const activities = await UserActivity.find(query).populate('userId', 'name email');
    res.status(200).json({ success: true, activities });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};



// DELETE: Delete all user activity records
export const deleteAllUserActivities = async (req, res) => {
  try {
    const result = await UserActivity.deleteMany({});
    res.status(200).json({ 
      success: true, 
      message: 'All user activity records have been deleted.', 
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to delete records' });
  }
};