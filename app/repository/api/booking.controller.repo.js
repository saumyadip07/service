const Booking=require("../../model/booking.model")
const User=require("../../model/user.model.js")
const mongoose=require("mongoose")


const createBooking=async(value,user)=>{

      const {serviceId,address,description,date}=value

      const booking=new Booking({
       
        serviceId:serviceId,
        address:address,
        description:description,
        date:date
      })

      booking.bookingId=booking._id.toString().slice(-4);
      booking.userId=user._id;

     const newbooking= await booking.save()

     return newbooking
}

const getAllBooking=async()=>{
    const bookings=await Booking.aggregate([
      {
        $lookup:{
          from:"users",
          localField:"userId",
          foreignField:"_id",
          as:"userDetails"
        }
      }
    ])

    return bookings
}

const getSingleBooking=async(id)=>{
    
    const booking=await Booking.aggregate([
      {
        $match: { _id:new mongoose.Types.ObjectId(id) }  
      },
      {
        $lookup:{
          from:"users",
          localField:"userId",
          foreignField:"_id",
          as:"userDetails"
        }
      }
    ])

    return booking.length?booking[0]:null
}

const BookingUpdate=async(id,employeeId)=>{
  
    
    const booking=await Booking.findOneAndUpdate({_id:id},{
      $set:{employeeId:employeeId}
    },{new:true})

    return booking
}

module.exports={createBooking,getAllBooking,getSingleBooking,BookingUpdate}

