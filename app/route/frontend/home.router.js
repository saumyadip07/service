const express=require("express");
const {verifyCustomerToken}=require("../../middleware/auth.view.middleware.js")


const HomeController=require("../../controller/frontend/home.controller.js")

const frontendRouter=express.Router();


frontendRouter.get("/",HomeController.index)
frontendRouter.get("/about",HomeController.about)
frontendRouter.get("/service",HomeController.service)
frontendRouter.get("/contact",HomeController.contact)

frontendRouter.get("/loginform",HomeController.loginform)
frontendRouter.post("/login",HomeController.login)
frontendRouter.get("/logout",verifyCustomerToken,HomeController.logout)

frontendRouter.get("/registerform",HomeController.registerform)
frontendRouter.post("/signup",HomeController.signup)
frontendRouter.get("/auth/confirmation/:email/:token", HomeController.confirmation);

frontendRouter.get("/book/:serviceId",verifyCustomerToken,HomeController.BookingDetails)
frontendRouter.post("/booking/:serviceId",verifyCustomerToken,HomeController.Booking)
frontendRouter.post("/book-service",verifyCustomerToken,HomeController.BookService)

frontendRouter.get("/user/dashboard",verifyCustomerToken,HomeController.userDashboard)

// contact
frontendRouter.post("/contact/submit",verifyCustomerToken,HomeController.contactSubmit)





module.exports=frontendRouter;