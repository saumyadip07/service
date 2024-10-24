const Joi=require("joi")


const serviceSchemaValidate=Joi.object({
    title:Joi.string().required(),
    description:Joi.string().required(),
    price:Joi.number().required(),
    
})


module.exports={serviceSchemaValidate}