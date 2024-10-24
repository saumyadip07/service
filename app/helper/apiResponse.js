class ApiResponse{

    constructor(statusCode,message,data){
        this.statusCode=statusCode,
       
        this.message=message,
        this.data=data



    }

    success=(res)=>{
        return res.status(this.statusCode??200 ).json({
            statusCode:this.statusCode,
            messgage:this.message,
            data:this.data
        })
    }
}

module.exports={ApiResponse}