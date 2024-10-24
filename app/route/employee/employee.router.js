const express=require("express")
const employeeController=require("../../controller/employee/employeeDashboard.controller.js")
const {verifyEmployeeToken}=require("../../middleware/auth.middleware.js")


const employeeRouter=express.Router()

employeeRouter.get("/",employeeController.home)
employeeRouter.post("/login",employeeController.login)
employeeRouter.get("/dashboard",verifyEmployeeToken,employeeController.dashboard)
employeeRouter.get("/booking",verifyEmployeeToken,employeeController.getBooking)
employeeRouter.get("/logout",verifyEmployeeToken,employeeController.logout)
employeeRouter.get("/booking/complete/:id",verifyEmployeeToken,employeeController.MarkAsComplete)

module.exports=employeeRouter