const mongoose=require("mongoose")
const User=require("../../model/user.model")
const Token=require("../../model/token.model")
const bcrypt=require("bcryptjs")


const createCustomer=async(value)=>{

    const {name,email,password}=value

    

    const hashedPassword=await bcrypt.hash(password,10)

    
     
    const customer= new User({
        name:name,
        email:email,
        password:hashedPassword
    })

    const newCustomer=await customer.save()


    console.log("newCustomer",newCustomer);
    

    return newCustomer
}

const getToken=async(token,role)=>{



    const receivedtoken=await Token.findOne({token,role})

    return receivedtoken
}

module.exports={createCustomer,getToken}