const mongoose=require("mongoose")

const ServiceSchema=new mongoose.Schema({

// customerId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
// description: {
//     type: String,
//     required: true
//   },
// status: {
//     type: String,
//     enum: ['pending', 'completed'],
//     default: 'requested'
//   },
// assignedEmployeeId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     default: null
//   },


      title:{
        type:String
      },
      description:{
        type:String
      },
      price:{
        type:Number
      },
      serviceImage:{
        type:String
      }

  

},
   {
    timestamps:true,
    versionKey:false
   }

)

const Service=mongoose.model("Service",ServiceSchema)

module.exports=Service