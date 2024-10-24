const Service=require("../../model/service.model")
const User=require("../../model/user.model")
const Token=require("../../model/token.model")
const Booking=require("../../model/booking.model.js")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const UserSchemaValidate=require("../../validation/auth.validate")
const bookingSchemaValidate=require("../../validation/booking.validate.js")
const {createCustomer,getToken}=require("../../repository/api/customer.controller.repo")
const {createBooking}=require("../../repository/api/booking.controller.repo.js")


const transporter = require("../../helper/mailer.js");
const crypto = require("crypto");
const Contact = require("../../model/contact.model.js")



class HomeController{

    index=async(req,res)=>{
        try {
            const authenticated = req.cookies.customerToken ? true : false
            let customerName=null
            if(authenticated){
            const decoded= jwt.verify(req.cookies.customerToken ,process.env.JWT_SECRET)
            customerName=decoded.name
            }

            const services=await Service.find()

            res.render("frontend/index",{services,authenticated,customerName})
        } catch (error) {
            console.log("error happened in home page",error.message);
        }
    }

    about=async(req,res)=>{
        try {
            const authenticated = req.cookies.customerToken ? true : false
            let customerName=null
            if(authenticated){
            const decoded= jwt.verify(req.cookies.customerToken ,process.env.JWT_SECRET)
             customerName=decoded.name
            }
            res.render("frontend/about",{authenticated,customerName})
        } catch (error) {
            console.log(error);
        }
    }

    
    service=async(req,res)=>{
        
        try {
            const services=await Service.find()

            const authenticated = req.cookies.customerToken ? true : false
            let customerName=null
            if(authenticated){
            const decoded= jwt.verify(req.cookies.customerToken ,process.env.JWT_SECRET)
             customerName=decoded.name
            }
            res.render("frontend/service",{services,authenticated,customerName})
        } catch (error) {
            console.log(error);
        }
    }

    
    contact=async(req,res)=>{
        try {
            const authenticated = req.cookies.customerToken ? true : false
            let customerName=null
            if(authenticated){
            const decoded= jwt.verify(req.cookies.customerToken ,process.env.JWT_SECRET)
           customerName=decoded.name
            }
            res.render("frontend/contact",{authenticated,customerName})
        } catch (error) {
            console.log(error);
        }
    }

    loginform=async(req,res)=>{
        try {
            res.render("frontend/loginform.ejs")
        } catch (error) {
            console.log("error happened while rendering login form",error.message);
            
        }
    }
    
    login=async(req,res)=>{
        try {
            const {email,password}=req.body
    
            const customer=await User.findOne({email,role:"customer"})
    
            if(!customer){
               console.log("customer not found");
               req.flash("error","customer not found enter valid email and password")
               res.redirect("/loginform")
               
            }
    
            
            if(!customer.isVerified){
                
                console.log("customer not verified");
                return
            }
    
            const comparedPassword = bcrypt.compareSync(password,customer.password)
    
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
     
                    res.cookie("customerToken",token,options)
                    req.flash("success","login successful")
                    res.redirect("/")
                    
                     
                }
                
            }
    
    
            console.log("either email or password is incorrect")
            req.flash("error","either email or password is incorrect")
             res.redirect("/loginform")
       
           
    
        } catch (error) {
           console.log("error happened while login customer",error.message);
         
           
        }
    }

    logout=async(req,res)=>{
       try {
        const options = {
            httpOnly: true,
            secure: true
        }

     
         res.clearCookie("customerToken", options)
     
        req.flash("success","logout successful") 
        return res.redirect("/")
       } catch (error) {
          console.log("error happened while logout customer",error.message);
        
          req.flash("error","error happened while logout customer")
          return res.redirect("/")
          
       } 
       
    
      }

      registerform=async(req,res)=>{
        try {
            res.render("frontend/registerform.ejs")
        } catch (error) {
            console.log("error happened while rendering registerfrom",error.message);
            
        }
      }

      signup = async (req, res) => {
        try {
          const { name, email, password } = req.body;
    
          const { error, value } = UserSchemaValidate.validate(req.body);
    
          if (error) {
           console.log("Invalid data",error.message);
           return 
           
          }
    
          const existedCustomer = await User.findOne({ email });
    
          if (existedCustomer) {
          console.log("email already registered");
          return
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
    
            html: `Hello ${newCustomer.name} , thank you for signup. \n\n please click on the below link to verify your account \n\n http://${req.headers.host}/auth/confirmation/${newCustomer.email}/${token.token}`, // html body
          });
    
          console.log("verification link has been sent to your mail");
       
          req.flash("success","verification link has been sent to your mail")
          return res.redirect("/loginform")
    
         
    
        } catch (error) {
          console.log("error happend while registering user",error.message);
          return
          
        }
      };

      confirmation = async (req, res) => {
        try {
          const { token } = req.params;
          const tokenRecord = await getToken(token,"customer");
          if (!token) {
            console.log("Token has been expired")
            return
          }
    
          // const user=await User.findOne({_id:token.userId,email:req.params.email})
          const user = await User.findOne({
            _id: tokenRecord.userId,
            email: req.params.email,
          });
    
          console.log(user);
    
          if (!user) {
            console.log("user is not found");
    
            req.flash("error","user is not found")
           return res.redirect("/loginform")
          } else if (user.isVerified) {
            console.log("user is already verified");
    
            req.flash("success","user is already verified")
           return res.redirect("/")
          } else {
             user.isVerified = true,
             await user.save();
            console.log("User verified successfully");
    
          
        
            await Token.findByIdAndDelete(tokenRecord._id)
         
            req.flash("success","user verified successfully")
           return res.redirect("/")
            
          }
        } catch (error) {
          console.log(error.message);
    
          return 
        }
      };

      BookingDetails=async(req,res)=>{
        try{

             const {serviceId}=req.params;
             const service=await Service.findById(serviceId)

             res.render("frontend/serviceDetail",{service})
        }catch(error){
          console.log("error happened while rendering service Details page",error.message);
          
        }
      }

      Booking=async(req,res)=>{
        try {
            const {serviceId}=req.params;
            const service=await Service.findById(serviceId)
            res.render("frontend/FinalBooking",{service})
        } catch (error) {
           console.log("error happend while rendering final booking page",error.message);
            
        }
      }

      BookService=async(req,res)=>{
        try {
            const {error,value}=bookingSchemaValidate.validate(req.body)

            if(error){
               console.log("Invalid data")
            }

            const booking=await createBooking(value,req.user)

           console.log("booking created");
           req.flash("success","booking created")
           return res.redirect("/user/dashboard")
           

        } catch (error) {
           console.log("error happened while creating booking",error.message);
           
        }
    }

    userDashboard=async(req,res)=>{
      try {
        const id=req.user._id;
        const user = await User.findById(id);
        const bookings=await Booking.aggregate([
          {
            $match:{userId:id}
          },
          {
            $lookup:{
              from:"services",
              localField:"serviceId",
              foreignField:"_id",
              as:"serviceDetails"
            }
          },
          {
            $unwind:"$serviceDetails"
          }
         
        ])

        res.render("frontend/userDashboard",{bookings,user})
      } catch (error) {
        console.log("error happened while rendering user dashboard",error.message)
      }
    }

    contactSubmit=async(req,res)=>{
      try {
        const {name,email,phone,message}=req.body
        const contact=new Contact({

          name:name,
          email:email,
          phone:phone,
          message:message

        })

        const newContact=await contact.save()
        console.log("contact submitted successfully");
        req.flash("success","contact submitted successfully")
        return res.redirect("/contact")
    }catch(error){
      console.log("error happened while submiting contact",error.message);
      req.flash("error","error happened while submiting contact")
      return res.redirect("/contact")
      
    }
  }



}


module.exports=new HomeController()