const User=require("../../model/user.model.js")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const mongoose=require("mongoose")
const Booking=require("../../model/booking.model.js")
class employeeController{
    home=async(req,res)=>{
        res.render("employee/employeeLoginForm.ejs")
    }

    login=async(req,res)=>{
        try {
            const {email,password}=req.body
    
            const employee=await User.findOne({email,role:"employee"})
    
            if(!employee){
               console.log("employee not found");
               return
               
            }
    
            
            if(!employee.isVerified){
                
                console.log("employee not verified");
                return
            }
    
            const comparedPassword = bcrypt.compareSync(password,employee.password)
    
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
     
                    res.cookie("employeeToken",token,options)
                    return res.redirect("/employee/dashboard")
                    
                     
                }
                
            }
    
    
           console.log("either email or password is incorrect");
           return
           
    
        } catch (error) {
           console.log("error happened while login employee",error.message);
           
        }
    }

    logout=async(req,res)=>{
        
        const options = {
            httpOnly: true,
            secure: true
        }

     
         res.clearCookie("employeeToken", options)
    
        return res.redirect("/employee")
    
      }


    dashboard=async(req,res)=>{
        try {
            const employee=await User.findById(req.user._id)
            res.render("employee/dashboard.ejs",{title:"Employee dashboard",employee})
        } catch (error) {
            console.log("error happened while rendering employee dashboard",error.message);
            
        }
    }

    getBooking=async(req,res)=>{
     try {
        const employeeId = req.user._id; // Assuming you have the employee's ID from the session or JWT

        const bookings = await Booking.aggregate([
            {
                $match: { employeeId:new mongoose.Types.ObjectId(employeeId) }
            },
            {
                $lookup: {
                    from: 'services',
                    localField: 'serviceId',
                    foreignField: '_id',
                    as: 'serviceDetails'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $unwind: '$serviceDetails'
            },
            {
                $unwind: '$userDetails'
            }
        ]);
    
        const employee=await User.findById(req.user._id)
        res.render('employee/booking', { bookings ,employee});
     } catch (error) {
        console.log("error happened while fetching bookings for individual employee's",error.message);
        return
     }



    }

    MarkAsComplete=async(req,res)=>{
        try {
            const {id}=req.params;
            const booking=await Booking.findByIdAndUpdate(id,{status:"completed"})

            return res.redirect("/employee/dashboard")
        } catch (error) {
            console.log("error happened while completing booking by employee",error.message);
            
        }
    }
}


module.exports=new employeeController()