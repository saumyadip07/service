const mongoose=require("mongoose")


const contactSchema=new mongoose.Schema({
    name:{
        type:String
    },
    phone:{
        type:Number
    },
    email:{
        type:String
    },
    message:{
        type:String
    }
}) 


const Contact=mongoose.model("Contact",contactSchema)

module.exports=Contact