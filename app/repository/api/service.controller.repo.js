const mongoose=require("mongoose")
const Service=require("../../model/service.model")


const createService=async(value)=>{

    const {title,description,price}=value
    const newservice=new Service({
        title:title,
        description:description,
        price:price
        
    })

   const service= await newservice.save()

   return service
}

const deleteService=async(id)=>{

    
    const deletedService=await Service.findByIdAndDelete(id)

    return deletedService
}


module.exports={createService,deleteService}