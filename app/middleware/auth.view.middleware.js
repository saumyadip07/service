const User=require("../model/user.model.js")
const jwt=require("jsonwebtoken")



const verifyCustomerToken=async(req,res,next)=>{
    try {
        const token = req.cookies?.customerToken || req.headers["Authorization"];
        
        // console.log(token);
        if (!token) {
           console.log("Unauthorized request")
           req.flash("error","Unauthorized request, login first")
           res.redirect("/loginform")
        }
    
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    
        const customer = await User.findById(decodedToken?.id).select("-password ")
    
        if (!customer) {
            
          console.log("Invalid Access Token")
          req.flash("error","Invalid request, login first")
          res.redirect("/loginform")
        }
    
        req.user = customer;
        next()
    } catch (error) {
       console.log("error happened while verify customer token",error.message)
       return
    }
}

const verifyAdminToken=async(req,res,next)=>{
    try {
        const token = req.cookies?.adminToken || req.headers["Authorization"];
        
        console.log(token);
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    
        const admin = await User.findById(decodedToken?.id).select("-password ")
        
        if (!admin) {
            
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = admin;
        next()
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message:error?.message
        })
    }
}


const verifyEmployeeToken=async(req,res,next)=>{
    try {
        const token = req.cookies?.employeeToken || req.headers["Authorization"];
        
        // console.log(token);
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    
        const employee = await User.findById(decodedToken?.id).select("-password ")
    
        if (!employee) {
            
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = employee;
        next()
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message:error?.message
        })
    }
}



module.exports={verifyCustomerToken,verifyAdminToken,verifyEmployeeToken}


