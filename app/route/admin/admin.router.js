const express=require("express")
const upload=require("../../helper/multer.js")
const adminController=require("../../controller/admin/adminDashboard.controller")
const {verifyAdminToken}=require("../../middleware/auth.middleware.js")

const adminRouter=express.Router()

adminRouter.get("/",adminController.home)
adminRouter.post("/login",adminController.login)
adminRouter.get("/dashboard",verifyAdminToken,adminController.dashboard)
adminRouter.get("/logout",adminController.logout)

//service
adminRouter.get("/service",verifyAdminToken,adminController.AllService)
adminRouter.get("/service/form",verifyAdminToken,adminController.CreateServiceForm)
adminRouter.post("/service/create",upload.single("serviceImage"),adminController.CreateService)
adminRouter.get("/service/delete/:id",verifyAdminToken,adminController.ServiceDelete)

//employee
adminRouter.get("/employee",verifyAdminToken,adminController.AllEmployee)
adminRouter.get("/employee/form",verifyAdminToken,adminController.CreateEmployeeForm)
adminRouter.post("/employee/create",adminController.CreateEmployee)
adminRouter.get("/employee/delete/:id",adminController.EmployeeDelete)


//booking
adminRouter.get("/booking",verifyAdminToken,adminController.getAllBooking)
adminRouter.post("/booking/assign/:bookingId",adminController.bookingAssign)

module.exports=adminRouter