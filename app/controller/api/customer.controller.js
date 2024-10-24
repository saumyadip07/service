const User = require("../../model/user.model.js");
const Token = require("../../model/token.model.js");
const UserSchemaValidate = require("../../validation/auth.validate.js");
const { ApiError } = require("../../helper/apiError.js");
const { ApiResponse } = require("../../helper/apiResponse.js");
const transporter = require("../../helper/mailer.js");
const crypto = require("crypto");
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")

const {
 createCustomer,
  getToken,
} = require("../../repository/api/customer.controller.repo.js");

class customerController {
  signup = async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const { error, value } = UserSchemaValidate.validate(req.body);

      if (error) {
        throw new ApiError(400, "Invalid data");
      }

      const existedCustomer = await User.findOne({ email });

      if (existedCustomer) {
        throw new ApiError(403, "email already registered");
      }

      const newCustomer = await createCustomer(req.body);

      console.log(newCustomer);

      const token = new Token({
        userId: newCustomer._id,
        role:"customer",
        token: crypto.randomBytes(16).toString("hex"),
      });

      const newtoken = await token.save();

      const info = await transporter.sendMail({
        from: "manutd.saumya7@gmail.com", // sender address
        to: newCustomer.email, // list of receivers
        subject: "Email verification", // Subject line

        html: `Hello ${newCustomer.name} , thank you for signup. \n\n please click on the below link to verify your account \n\n http://${req.headers.host}/api/auth/confirmation/${newCustomer.email}/${token.token}`, // html body
      });

      console.log("verification link has been sent to your mail");

      return new ApiResponse( 200,
        "User registered Successfully plese confirm your email by clicking on the verification link",
        newCustomer).success(res)

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  confirmation = async (req, res) => {
    try {
      const { token } = req.params;
      const tokenRecord = await getToken(token,"customer");
      if (!token) {
        throw new ApiError(400, "token has been expired");
      }

      // const user=await User.findOne({_id:token.userId,email:req.params.email})
      const user = await User.findOne({
        _id: tokenRecord.userId,
        email: req.params.email,
      });

      console.log(user);

      if (!user) {
        console.log("user is not found");

        throw new ApiError(400, "user is not found");
      } else if (user.isVerified) {
        console.log("user is already verified");

        throw new ApiError(400, "user is already verified");
      } else {
         user.isVerified = true,
         await user.save();
        console.log("User verified successfully");

      
    
        await Token.findByIdAndDelete(tokenRecord._id)
        return new ApiResponse(200,"User verified successfully").success(res)
        
      }
    } catch (error) {
      console.log(error.message);

      res.status(error.code || 500).json({
        success: false,
        message: error.message,
      });
    }
  };

  signin=async(req,res)=>{
    try {
        const {email,password}=req.body

        const customer=await User.findOne({email})

        if(!customer){
            throw new ApiError(400,"customer not found")
        }

        
        if(!customer.isVerified){
            
            throw new ApiError(400,"customer is not verified")
        }

        const comparedPassword =await bcrypt.compareSync(password,customer.password)

        if(customer && comparedPassword){

            const token=jwt.sign({
                id:customer._id,
                name:customer.name,
                email:customer.email,
                role:customer.role

            },process.env.JWT_SECRET,{expiresIn:'3d'})

            const options = {
                httpOnly: true,
                secure: true
            }
            if(token){
 
                return res.
                cookie("customerToken",token,options).
                json(new ApiResponse(200,"User signin successfully",token))
                 
            }
            
        }


        return new ApiError(400,"Either email or password is wrong")

    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success:false,
            message:error.message
        })
    }
  }
  logout=async(req,res)=>{

        const options = {
            httpOnly: true,
            secure: true
        }
        return res
        .status(200)
        .clearCookie("customerToken", options)
    
        .json(new ApiResponse(200, {}, "User logged Out"))
    
        
        
  }

}

module.exports = new customerController();
