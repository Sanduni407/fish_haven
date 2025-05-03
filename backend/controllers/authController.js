import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';
import employeeSalaryModel from '../models/salaryModel.js';


//create a user account

const registerUser = async (req, res)=>{

    const{name,businessName,businessRegNo,address,email,phone,role,password} = req.body;

    // check these fields have the values
    if(!name || !email || !address || !phone || !role || !password)
    {
        return res.json({success:false, message:"Missing Details"})
    }


    try{
        // find the user using the email
        const existingUser = await userModel.findOne({email})

        //if the user already exists return this
        if(existingUser)
        {
            return res.json({success: false, message: " User already exists"});
        }
         
        // hashed the password as others can't identify
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({name,businessName,businessRegNo,address,email,phone,role,password:hashedPassword});

        const newUser = await user.save();

        if (role === "Employer") {
            await employeeSalaryModel.create({
              empId: newUser._id,
              name: newUser.name
            });
          }

        // send the email which contains the login credentials
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject:'Welcome to Fish Haven',
           // text:`welcome to Fish Haven website , your account has been created successfully.
             // use these login credentials to log in to the Fish Haven website email id : ${email} password : ${password}`

             html: `<h1 style="text-align:center; color:#3a3e78"> Dear ${name} your account has been created successfully</h1>
             <br/></br> <h3 style="text-align:center;">Email id : ${email} <br/> Password : ${password}</h3>`
        }

        await transporter.sendMail(mailOptions);

        res.json({success:true, message:"User registered successfully"});



    }catch(error)
    {
        console.log(error)
         res.json({success:false, message: error.message})
    }
}


//login user

const loginUser = async(req,res)=>{

    const{email,password} = req.body;
    
    if(!email || !password)
    {
        return res.json({success:false, message:"email and password are required"})
    }

    try
    {
        const user = await userModel.findOne({email});

        if(!user)
        {
           return res.json({success:false, message: "Invalid email or user doesn't exist"})
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch)
        {
            return res.json({success:false, message:"Invalid password"})
        }

        const token = createToken(user._id);

        res.json({success:true, token , role:user.role});


    }
    catch(error)
    {
        console.log(error)
        res.json({success:false, message: error.message})
    }

}

//create token

const createToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET)
}


//send otp to reset password

const sendResetOtp = async(req,res)=>{
   const{email} = req.body;

   if(!email)
   {
    return res.json({success:false, message:'Email is required'});
   }

   try{

    const user = await userModel.findOne({email})

    if(!user)
    {
        return res.json({success:false, message:"user not found"});
    }

     const otp = generateOTP();

     user.resetOtp = otp;
     user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000;

     await user.save();

     const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject:'Password reset OTP',
        html: `<h3 style="text-align:center;">Your OTP for resetting your password is ${otp}</h3>`
    }

    await transporter.sendMail(mailOptions);

    res.json({success:true, message:"OTP sent to your email"});

   }
   catch(error)
   {
    console.log(error)
    res.json({success:false, message: error.message})
   }

}

//otp generate

const generateOTP = ()=>{

  const otp = String(Math.floor(100000 + Math.random()*900000));
  return otp;
}


//reset user password

const resetPassword = async(req,res)=>{

    const{email,otp,newPassword} = req.body;

    if(!email || !otp || !newPassword){

        return res.json({success:false, message:"email,otp and new password are requirred"})
    }

    try{

        const user = await userModel.findOne({email});
        if(!user)
        {
            return res.json({success:false, message:"user not found"}) 
        }

        if(user.resetOtp === "" || user.resetOtp != otp)
        {
            return res.json({success:false, message:"Invalid Otp"}) 
        }

        if(user.resetOtpExpireAt < Date.now())
        {
            return res.json({success: false, message: 'OTP Expired'})
        }

        const hashedPassword = await bcrypt.hash(newPassword,10);

        user.password = hashedPassword;
        user.resetOtp = "";
        user.resetOtpExpireAt = 0;



       await user.save();

       return res.json({success: true, message: 'Password has been reset successfully'})

    }catch(error)
    {
        console.log(error)
        res.json({success:false, message: error.message})
    }

}


//fetch all user account details from the database and display to admin
const getAllUserAccounts = async(req,res)=>{


    try{

        const users = await userModel.find();
        

        return res.json({success: true, users})

    }catch(error)
    {
        console.log(error)
        res.json({success:false, message: error.message})
    }


}


//get user details by id to display in user profiles

const getuserDetailsById = async(req,res)=>{

    const id = req.body.userId;

    if(!id)
    {
        return res.json({success:false , message:'required details are missing'});
    }

    try{

        const user = await userModel.findById(id);

        if(!user)
        {
            return res.json({success:false , message:'invalid id'});
        }

        return res.json({success: true, user})

    }catch(error)
    {
        console.log(error)
        res.json({success:false, message: error.message})
    }

}

const updateUserById = async(req,res)=>{

     const id = req.params.id; // Get user id from request parameters
        const { name, businessName, businessRegNo, address, email, phone } = req.body; // Get data from request body
    
        
        try {
           await userModel.findByIdAndUpdate(id, //find user by id and update
                { name: name, businessName: businessName, businessRegNo: businessRegNo, address: address, email: email, phone: phone },{new:true});
               
        } catch (err) {
            console.log(err); // If error
        }
    
         return res.status(200).json({ success:true, message:'successfully updated' });

}

const deleteUser = async (req, res) => {

    const id = req.params.id; // Get user id from request parameters
    
    try {
       const user = await userModel.findByIdAndDelete(id); // Find user by id and delete

         if (!user) { // If user not found
        return res.status(404).json({ success: false,message: 'unable to delete' });
    }

    return res.status(200).json({ success:true,message: 'User deleted successfully' }); // If user deleted successfully

    } catch (err) {
        console.log(err); // If error
        res.json({success:false, message: err.message})
    } 
  
}; 
 
export {registerUser,loginUser,sendResetOtp,resetPassword, getAllUserAccounts, getuserDetailsById,updateUserById,deleteUser}