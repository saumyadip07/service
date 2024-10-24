const User = require("../../model/user.model.js");
const Token = require("../../model/token.model.js");
const UserSchemaValidate = require("../../validation/auth.validate.js");
const { ApiError } = require("../../helper/apiError.js");
const { ApiResponse } = require("../../helper/apiResponse.js");
const transporter = require("../../helper/mailer.js");
const crypto = require("crypto");
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")



class employeeController{

    signin=async(req,res)=>{

        try {
        
                const {email,password}=req.body
        
                const employee=await User.findOne({email})
        
                if(!employee){
                    throw new ApiError(400,"employee not found")
                }
        
                
              
        
                const comparedPassword =await bcrypt.compareSync(password,employee.password)
        
                if(employee && comparedPassword){
        
                    const token=jwt.sign({
                        id:employee._id,
                        name:employee.name,
                        email:employee.email,
                        role:employee.role
        
                    },process.env.JWT_SECRET,{expiresIn:'3d'})
        
                    const options = {
                        httpOnly: true,
                        secure: true
                    }
                    if(token){
         
                        return res.
                        cookie("employeeToken",token,options).
                        json(new ApiResponse(200,"employee signin successfully",token))
                         
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
        .clearCookie("employeeToken", options)
    
        .json(new ApiResponse(200, {}, "employee logged Out"))
    
        
    }


}


module.exports=new employeeController()