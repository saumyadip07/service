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
 createAdmin,
  getToken,
  createEmployee
} = require("../../repository/api/admin.controller.repo.js");

class adminController {
  signup = async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const { error, value } = UserSchemaValidate.validate(req.body);

      if (error) {
        throw new ApiError(400, "Invalid data");
      }

      const existedAdmin = await User.findOne({ email });

      if (existedAdmin) {
        throw new ApiError(400, "email already registered");
      }

      const newAdmin = await createAdmin(req.body);

      console.log(newAdmin);

      const token = new Token({
        userId: newAdmin._id,
        role:"admin",
        token: crypto.randomBytes(16).toString("hex"),
      });

      const newtoken = await token.save();

      const info = await transporter.sendMail({
        from: "manutd.saumya7@gmail.com", // sender address
        to: newAdmin.email, // list of receivers
        subject: "Email verification", // Subject line

        html: `Hello ${newAdmin.name} , thank you for signup. \n\n please click on the below link to verify your account \n\n http://${req.headers.host}/api/admin/confirmation/${newAdmin.email}/${token.token}`, // html body
      });

      console.log("verification link has been sent to your mail");

      return new ApiResponse( 200,
        "User registered Successfully plese confirm your email by clicking on the verification link",
        newAdmin).success(res)

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
      const tokenRecord = await getToken(token,"admin");
      console.log(tokenRecord)
      if (!token) {
        throw new ApiError(400, "token has been expired");
      }

       if(!tokenRecord){
        throw new ApiError(404, "token not found");
       }
      // const user=await User.findOne({_id:token.userId,email:req.params.email})
      const admin = await User.findOne({

        _id: tokenRecord?.userId,
        email: req.params.email,
      });

      console.log(admin);

      if (!admin) {
        console.log("Admin is not found");

        throw new ApiError(400, "Admin is not found");
      } else if (admin.isVerified) {
        console.log("Admin is already verified");

        throw new ApiError(400, "Admin is already verified");
      } else {
        admin.isVerified = true,
         await admin.save();
        console.log("Admin verified successfully");

      
        await Token.findByIdAndDelete(tokenRecord._id)
        return new ApiResponse(200,"Admin verified successfully").success(res)
        
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

        const admin=await User.findOne({email})

        if(!admin){
            throw new ApiError(400,"admin not found")
        }

        
        if(!admin.isVerified){
            
            throw new ApiError(400,"admin is not verified")
        }

        const comparedPassword = bcrypt.compareSync(password,admin.password)

        if(admin && comparedPassword){

            const token=jwt.sign({
                id:admin._id,
                name:admin.name,
                email:admin.email,
                role:admin.role

            },process.env.JWT_SECRET,{expiresIn:'3d'})

            const options = {
                httpOnly: true,
                secure: true
            }
            if(token){
 
                return res.
                cookie("adminToken",token,options).
                json(new ApiResponse(200,"admin signin successfully",{token}))
                 
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
        .clearCookie("adminToken", options)
    
        .json(new ApiResponse(200,"admin logged Out", {} ))
    
        
        
  }

  employeeSignup=async(req,res)=>{
    try {
        if(!(req.user.role==='admin')){

             throw new ApiError("401","Admin can create employee only")

        }

        const {name,email,password}=req.body

        const {error,value}=UserSchemaValidate.validate(req.body)

        if(error){
            throw new ApiError(401,"Invalid data")
        }

        const existedEmployee = await User.findOne({ email });

        if (existedEmployee) {
          throw new ApiError(403, "email already registered");
        }

        const employee=await createEmployee(value)
       

        return res.status(200).
        json(new ApiResponse(200,"employee created successfully",employee))


    } catch (error) {
        return res.status(error.statusCode||500).json({
            message:error?.message|| "error occured while creating employee"
        })
    }
  }

}

module.exports = new adminController();
