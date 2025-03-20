import bcrypt from 'bcryptjs';
//import jwt from 'jsonwebtoken';
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


export {registerUser}