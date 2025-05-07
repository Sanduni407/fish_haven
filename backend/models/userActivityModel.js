import mongoose from 'mongoose';

const userActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  action: {
    type: String,
    required: true // e.g., "login", "register", "profile_updated"
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  details: {
    type: String // e.g., "User logged in with email example@domain.com"
  }
});

const userActivityModel = mongoose.models.UserActivity || mongoose.model('UserActivity', userActivitySchema);

export default userActivityModel;