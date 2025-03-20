import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';



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








export {registerUser, loginUser}
