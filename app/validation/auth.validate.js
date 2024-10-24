const Joi=require("joi")


const UserSchemaValidate=Joi.object({
    name:Joi.string().required(),
    email:Joi.string().email().required(),
    password:Joi.string(),
    role:Joi.string().valid("admin","employee","customer")
})

module.exports=UserSchemaValidate