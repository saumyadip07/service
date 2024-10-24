
const Service=require("../../model/service.model.js")
const {serviceSchemaValidate}=require("../../validation/service.validate.js")
const {ApiError}=require("../../helper/apiError.js")
const {ApiResponse}=require("../../helper/apiResponse.js")
const {createService,deleteService}=require("../../repository/api/service.controller.repo.js")
const { findById } = require("../../model/user.model.js")
const fs=require("fs")
const path=require('path')


class serviceController{
    create=async(req,res)=>{


        try {
            const {title,description,price}=req.body

            const{error,value}=serviceSchemaValidate.validate(req.body)
            if(error){
                throw new ApiError(400,"Invalid data")
            }
    
            const newService=await createService(value)

            let url=`${req.protocol}://${req.get("host")}/upload/`

            if(req.file){
                newService.serviceImage=`${url}${req.file.filename}`

            }

            const service=await newService.save()

            return res.status(201).json(
                new ApiResponse(200,"service is created",service)
            )

        } catch (error) {
            return res.status(error.code||500).json({
                status:false,
                message:error.message
            })
        }
    

     }
     list=async(req,res)=>{

        try {
            const service=await Service.find()

            return res.status(200).json(
                new ApiResponse(200,"All service fetched",service)
            )
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                message:error.message
            })
        }

     }

    delete=async(req,res)=>{
        try {
            const {id}=req.params;
            const service=await Service.findById(id)

            let imageUrl=service.serviceImage
            imageUrl=imageUrl.split("/")
 
            let filename=[imageUrl[imageUrl.length-1]]
            let filepath=path.join(__dirname,`../../../upload/${filename}`)
            fs.unlinkSync(filepath)

            const deletedService=await deleteService(id)

            return res.status(200).json(
                new ApiResponse(200,"service deleted",deletedService)
            )
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                message:error.message
            })
        }
     }
}

module.exports=new serviceController()