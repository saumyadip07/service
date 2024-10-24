const Service=require("../../model/service.model.js");
const User=require("../../model/user.model.js")
const Booking=require("../../model/booking.model.js")
const UserSchemaValidate=require("../../validation/auth.validate.js")
const {serviceSchemaValidate}=require("../../validation/service.validate.js")
const path=require("path")
const fs=require("fs")
const mongoose=require("mongoose")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")


class adminController{
    home=async(req,res)=>{
        res.render("admin/adminLoginForm")
    }

    login=async(req,res)=>{
        try {
            const {email,password}=req.body
    
            const admin=await User.findOne({email,role:"admin"})
    
            if(!admin){
               console.log("Admin not found");
               return
               
            }
    
            
            if(!admin.isVerified){
                
                console.log("Admin not verified");
                return
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
     
                    res.cookie("adminToken",token,options)
                    return res.redirect("/admin/dashboard")
                    
                     
                }
                
            }
    
    
           console.log("either email or password is incorrect");
           return
           
    
        } catch (error) {
           console.log("error happened while login admin",error.message);
           
        }
      }

      logout=async(req,res)=>{
        
        const options = {
            httpOnly: true,
            secure: true
        }

     
         res.clearCookie("adminToken", options)
    
        return res.redirect("/admin")
    
      }

    dashboard=async(req,res)=>{
        try {
           const admin=await User.findById(req.user._id)
            res.render("admin/dashboard.ejs",{title:"Admin dashboard",admin})
        } catch (error) {
            console.log("error happened while rendering admin dashboard",error.message);
            
        }
    }

    //service
    AllService=async(req,res)=>{
        try {

            const admin=await User.findById(req.user._id)


            const services=await Service.find()

            res.render("admin/service.ejs",{title: "All Services",services,admin})
        } catch (error) {
            console.log("error happened while fetching all service in admin dashboard",error.message);
            
        }
    }

    CreateServiceForm=async(req,res)=>{
        try {
            const admin=await User.findById(req.user._id)
            res.render("admin/serviceCreateForm.ejs",{title:"Service create form",admin})
        } catch (error) {
            console.log("error happened while rendering service create form",error.message);
            
        }
    }

    CreateService=async(req,res)=>{
        try {
            const {title,description,price}=req.body

            const{error,value}=serviceSchemaValidate.validate(req.body)
            if(error){
                console.log("Invalid data from service create form");
                
            }
    
            const newService=await Service.create(value)

            let url=`${req.protocol}://${req.get("host")}/upload/`

            if(req.file){
                newService.serviceImage=`${url}${req.file.filename}`

            }

            const service=await newService.save()

            res.redirect("/admin/service")

        } catch (error) {
           console.log("error happened while creating service from admin",error.message);
           return
           
        }
    
    }
    ServiceDelete=async(req,res)=>{
        try {
            const {id}=req.params;
            const service=await Service.findById(id)

            let imageUrl=service.serviceImage
            imageUrl=imageUrl.split("/")
 
            let filename=imageUrl[imageUrl.length-1]
            let filepath=path.join(__dirname,`../../../upload/${filename}`)
            fs.unlinkSync(filepath)

            const deletedService=await Service.findByIdAndDelete(id)

            res.redirect("/admin/service")
        } catch (error) {
            console.log("error happened while deleting service ",error.message);
            
        }
    }


// employee    

    AllEmployee=async(req,res)=>{
        try {
            const employees=await User.find({role:"employee"})
            const admin=await User.findById(req.user._id)
            
            res.render("admin/employee.ejs",{title:"All employee",employees,admin})
        } catch (error) {
            console.log("error happened while fetching all employee",error.message);
            
        }
    }
    CreateEmployeeForm=async(req,res)=>{
        try {
            const admin=await User.findById(req.user._id)
            res.render("admin/employeeCreateForm.ejs",{admin})
        } catch (error) {
            console.log("error happened while rendering employee create form",error.message);
            
        }
    }
    CreateEmployee=async(req,res)=>{
        try {
            const {name,email,password}=req.body

            const {error,value}=UserSchemaValidate.validate(req.body)

            if(error){
              console.log("invalid data from employee create form");
              return
              
            }

            const existedEmployee=await User.findOne({email})
            if(existedEmployee){
                console.log("email  already exists");
                return
                
            }

            const hashedPassword=await bcrypt.hash(password,10)

            const employee=new User({
                name:name,
                email:email,
                password:hashedPassword,
                role:"employee",
                isVerified:true
            })

            await employee.save()

            res.redirect("/admin/employee")

        } catch (error) {
            console.log("error happened while creating employee from admin",error.message);
            
        }
    }
    EmployeeDelete=async(req,res)=>{
        try {
            const {id}=req.params;
            const deletedEmployee=await User.findByIdAndDelete(id)

            res.redirect("/admin/employee")
        } catch (error) {
            console.log("error happened while deleting employee",error.message);
            
        }
    }


    // Booking
    getAllBooking=async(req,res)=>{

         try {
            const bookings = await Booking.aggregate([
                {
                    $lookup: {
                        from: 'services', // The name of the service collection
                        localField: 'serviceId',
                        foreignField: '_id',
                        as: 'serviceDetails'
                    }
                },
                {
                    $lookup: {
                        from: 'users', // The name of the user collection
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'userDetails'
                    }
                },
                {
                    $lookup: {
                      from: "users", // The collection to join (users collection)
                      localField: "employeeId", // Field from the booking schema
                      foreignField: "_id", // Field from the user schema
                      as: "employeeDetails", // The name of the new array field to add to the output
                    },
                  },

                {
                    $unwind: '$serviceDetails'
                },
                {
                    $unwind: '$userDetails'
                },
                {
                    $unwind: {
                        path: "$employeeDetails", // Unwind the employeeDetails array to a single object
                        preserveNullAndEmptyArrays: true,
                    }
                }
            ]);

            const employees=await User.find({role:"employee"})
         

            const admin=await User.findById(req.user._id)
        
            res.render('admin/booking.ejs', { bookings,employees,admin });
         } catch (error) {
            console.log("error happened while fetching all booking for admin",error.message);
            
         }
    }

    bookingAssign=async(req,res)=>{
        try {
            const { bookingId} = req.params
            const {employeeId}=req.body

           

           const assigned= await Booking.findByIdAndUpdate(bookingId, 
                { 
                    employeeId:new mongoose.Types.ObjectId(employeeId),
                    status: "onprogress"
                
                }
            );

            res.redirect("/admin/booking")
        
        } catch (error) {
            console.log("error happened while assignin booking to employee",error.message);
            return
            
        }
    }
}


module.exports=new adminController()