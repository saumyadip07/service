const multer=require("multer")


const FILE_TYPE={
    "image/jpg":"jpg",
    "image/jpeg":"jpeg",
    "image/png":"png"
}

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        
        let isValid=FILE_TYPE[file.mimetype]

        let isError=  new Error("Invalid image type")

        if(isValid){
            isError=null
        }

        cb(isError,"upload/")
    },
    filename:function(req,file,cb){
        cb(null,`${Date.now()}-${file.originalname}`)
    }
})

const upload=multer({storage:storage})

module.exports=upload