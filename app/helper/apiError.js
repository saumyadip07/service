class ApiError extends Error{
    constructor(statusCode,message="something went wrong", errors = []){

        super()
        this.statusCode=statusCode,
        this.message=message,
        this.errors=errors
    }

  
}

module.exports={ApiError}