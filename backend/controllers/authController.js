import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import cors from "cors";
import transporter from "../src/db/nodemailer.js";
//register function starts here
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: "false", message: "All fields are required" });
  }
  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: "false", message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ name, email, password: hashedPassword });
    await user.save(); //user saved to database

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    //Sending welcome email to the user
    const mailOptions ={
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Welcome!',
      text: `Welcome to my website . Your account has been created with email id:${email}`
    }

    await transporter.sendMail(mailOptions);

    return res.json({ success: true });

  } catch (error) {
    res.json({ success: "false", message: error.message });
  }
}; //register function ends here

//login function starts here
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: "false", message: "email and password are required" });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: "false", message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: "false", message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
}; //login function ends here

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//send the verification otp 
export const sendVerifyOtp = async(req, res)=>{
   try{
     const userId = req.userId;
     const user = await userModel.findById(userId);
       if (user.isAccountVerified){
        return res.json({success: false, message: "Account Already verified"})
       }

   const otp = String(Math.floor(100000 + Math.random()* 900000));

   user.verifyOtp = otp;
   user.verifyOtpExpireAt = Date.now()+ 24* 60 *60*1000

   await user.save();
   const mailOptions ={
     from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'Account Verification OTP',
      text: `Your OTP is ${otp}. Verify your account using this OTP. `

   }
   await transporter.sendMail(mailOptions);
   
   res.json({success: true, message: "verification otp sent on Email "});

   }catch(error){
     res.json({success: false , messege: error.messege})
   }
};

export const verifyEmail = async (req, res)=>{
  const { otp } = req.body;
  const userId = req.userId;

  if(!userId || !otp){
   return res.json({success: false, message:'Missing Details'})
  }

  try {
   const user = await userModel.findById(userId);
    
    if(!user){
      return res.json({success: false, message: 'User not found'});
    }
    if(user.verifyOtp === '' || user.verifyOtp !== otp){
      return res.json({success: false, message: 'Invalid OTP'});
    }

    if(user.verifyOtpExpireAt< Date.now()){
       return res.json({success: false, message: 'OTP Expired'});
    }
    user.isAccountVerified = true;
    user.verifyOtp=''
    user.verifyOtpExpireAt=0;

    await user.save();
    return res.json({success: true, message: 'Email verified successfully'});

   } catch (error) {
       return res.json({success: false, message: error.messege})
   }
}