import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js'; // Import userModel to fetch user

const userAuth = async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res.json({ success: false, message: "Not Authorized. Login Again" });
  }

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(token_decode.id); // Fetch user
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    req.user = { _id: user._id, email: user.email, name: user.name }; // Add user to req
    req.body.userId = token_decode.id; // Keep existing for compatibility
    next();
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Error" });
  }
};

export default userAuth;