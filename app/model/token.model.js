const mongoose=require("mongoose")


const TokenSchema=new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    token:{
        type:String,
        
    },
    role:{
        type:String,
        enum:['admin','employee','customer']
    },
    expiredAt:{
        type:Date,
        default:Date.now(),
        index:{
            expires:60*60*24*1000
        }
    }
     
},
{
    timestamps:true,
    versionKey:false
})


const Token=mongoose.model("Token",TokenSchema)

module.exports=Token