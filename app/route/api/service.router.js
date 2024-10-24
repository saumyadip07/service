const express=require("express")
const serviceController=require("../../controller/api/service.controller")
const upload=require("../../helper/multer.js")
const {verifyAdminToken}=require("../../middleware/auth.middleware.js")

const serviceRouter=express.Router()

serviceRouter.post("/service/create",verifyAdminToken,upload.single("serviceImage"),serviceController.create)
serviceRouter.get("/service",serviceController.list)
serviceRouter.post("/service/delete/:id",verifyAdminToken,serviceController.delete)



module.exports=serviceRouter
