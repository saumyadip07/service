const mongoose=require("mongoose")

const BookingSchema=new mongoose.Schema({

     bookingId:{
        type:String
     },
     serviceId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Service"
     },

     description:{
      type:String
     },

     userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
     },
     employeeId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
     },
     date:{
        type:Date
     },
     address:{
      type:String
     },

     status:{
        type:String,
        enum:["pending","onprogress","completed","cancel"],
        default:"pending"
     }

     
},{
    timestamps:true,
    versionKey:false
}
)


const Booking=mongoose.model("Booking",BookingSchema)

module.exports=Booking