const Booking=require("../../model/booking.model")
const bookingSchemaValidate=require("../../validation/booking.validate.js")
const {ApiError}=require("../../helper/apiError.js")
const { ApiResponse } = require("../../helper/apiResponse.js")
const {createBooking, getAllBooking, getSingleBooking,BookingUpdate}=require("../../repository/api/booking.controller.repo.js")


class BookingController{

    create=async(req,res)=>{
        try {
            const {error,value}=bookingSchemaValidate.validate(req.body)

            if(error){
                throw new ApiError(400,"Invalid data")
            }

            const booking=await createBooking(value,req.user)

            return res.status(200).json(
                new ApiResponse(200,"booking created",booking)
            )

        } catch (error) {
            return res.status(error.statusCode||500).json({
                status:false,
                message:error?.message||"error happend while creating booking"
            })
        }
    }

    list=async(req,res)=>{
        try {
            const bookings=await getAllBooking();

            return res.status(200).json(
                new ApiResponse(200,"all booking fetched",bookings)
            )
        } catch (error) {
            return res.status(error.statusCode||500).json({
                status:false,
                message:error?.message || "error happened while fetching all booking"
            })
        }
    }

    singleBooking=async(req,res)=>{
        try {
            const {id}=req.params

            const booking=await getSingleBooking(id)

            return res.status(200).json(
                new ApiResponse(200,"single booking",booking)
            )
        } catch (error) {
            return res.status(error.statusCode||500).json({
                status:false,
                message:error?.message||"error happened while fetching single booking"
            })
        }
    }

    updateBooking=async(req,res)=>{
        try {
            const {id}=req.params;
            const {employeeId}=req.body

            const updatedBooking=await BookingUpdate(id,employeeId)

            return res.status(200).json(
                new ApiResponse(200,"booking assigned to employee",updatedBooking)
            )
        } catch (error) {
            return res.status(error.statusCode||500).json({
                status:false,
                message:error?.message || "Booking assigned to employee failed"
            })
        }
    }
}


module.exports=new BookingController()