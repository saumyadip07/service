const express=require("express")
const BookingController=require("../../controller/api/booking.controller")
const {verifyCustomerToken,verifyAdminToken}=require("../../middleware/auth.middleware.js")


const BookingRouter=express.Router()

BookingRouter.post("/booking/create",verifyCustomerToken,BookingController.create)
BookingRouter.get("/booking",verifyAdminToken,BookingController.list)
BookingRouter.get("/booking/:id",verifyAdminToken,BookingController.singleBooking)

BookingRouter.patch("/booking/:id",verifyAdminToken,BookingController.updateBooking)






module.exports=BookingRouter