const express=require("express")
const dotenv=require("dotenv")
const cors=require("cors")
const bodyParser=require("body-parser")
const path=require("path")
const ejs=require("ejs")
const connectDB=require("./app/config/db.cofig")
const cookieParser = require("cookie-parser")
const session = require('express-session');
const flash = require('connect-flash');


dotenv.config()

const app=express()

connectDB()

app.use(session({
    secret: 'express_session_secret', // Replace with your own secret key
    resave: false,
    saveUninitialized: true
}));

app.use(flash());
app.use((req, res, next) => {
    res.locals.successMsg = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use(cors())
app.use(cookieParser())


app.set("view engine","ejs")
app.set("views","views")


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,"public")))

app.use("/Upload",express.static(path.join(__dirname,"Upload")))




// import router
// api
const authRouter=require("./app/route/api/auth.router.js")
const serviceRouter=require("./app/route/api/service.router.js")
const bookingRouter=require("./app/route/api/booking.router.js")
app.use("/api",authRouter)
app.use("/api",serviceRouter)
app.use("/api",bookingRouter)


//admin
const adminRouter=require("./app/route/admin/admin.router.js")
app.use("/admin",adminRouter)

//employee
const employeeRouter=require("./app/route/employee/employee.router.js")
app.use("/employee",employeeRouter)


//frontend
const frontendRouter=require("./app/route/frontend/home.router.js")
app.use(frontendRouter)


const PORT=process.env.PORT
app.listen(PORT,()=>{
    console.log(`server is listening at port ${PORT}` );
    
})

