const express = require("express");
const customerController = require("../../controller/api/customer.controller");
const adminController=require("../../controller/api/admin.controller.js")
const employeeController=require("../../controller/api/employee.controller.js")
const {verifyCustomerToken,verifyAdminToken,verifyEmployeeToken}=require("../../middleware/auth.middleware.js")

const authRouter = express.Router();

//admin
authRouter.post("/admin/signup", adminController.signup);
authRouter.get("/admin/confirmation/:email/:token", adminController.confirmation);

authRouter.post("/admin/signin", adminController.signin);
authRouter.post("/admin/logout",verifyAdminToken,adminController.logout)
authRouter.post("/admin/employee/signup",verifyAdminToken,adminController.employeeSignup)

//employee

authRouter.post("/employee/signin", employeeController.signin);
authRouter.post("/employee/logout",verifyEmployeeToken,employeeController.logout)

//customer
authRouter.post("/signup", customerController.signup);
authRouter.get("/auth/confirmation/:email/:token", customerController.confirmation);

authRouter.post("/signin", customerController.signin);
authRouter.post("/logout",verifyCustomerToken,customerController.logout)


module.exports = authRouter;
