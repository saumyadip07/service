const mongoose=require("mongoose")


const connectDB=async()=>{
    try {
        const connection=await mongoose.connect(`${process.env.MONGO_URL}${process.env.DB_NAME}`)
        console.log(`successfully connected to database ${connection.connection.host}`);
        

    } catch (error) {
        console.log(`error happened while connecting to database ${error}`);
        
    }
}

module.exports=connectDB