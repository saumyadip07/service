const mongoose=require("mongoose")
const User=require("../../model/user.model")
const Token=require("../../model/token.model")
const bcrypt=require("bcryptjs")


const createAdmin=async(value)=>{

    const {name,email,password}=value

    

    const hashedPassword=await bcrypt.hash(password,10)

    
     
    const admin= new User({
        name:name,
        email:email,
        password:hashedPassword
    })

    const newAdmin=await admin.save()


    console.log("newAdmin",newAdmin);
    

    return newAdmin
}

const getToken=async(token,role)=>{



    const receivedtoken=await Token.findOne({token,role})
    

    return receivedtoken
}





const createEmployee=async(value)=>{

    const {name,email,password}=value

    

    const hashedPassword=await bcrypt.hash(password,10)

    
     
    const employee= new User({
        name:name,
        email:email,
        password:hashedPassword
    })

    employee.role="employee"
    employee.isVerified=true;

    const newEmployee=await employee.save()


    console.log("newEmployee",newEmployee);
    

    return newEmployee
}


module.exports={createAdmin,getToken,createEmployee}