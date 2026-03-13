class APIError extends Error{
    contructor(statusCode,message='something went wrong',error=[],stack=''){
        this.statusCode = statusCode;
        this.error = error;
        this.message = message;
        this.success = false;

        if(stack){
            this.stack = stack;
        }else{
            Error.captureStackTrace(this,this.contructor);
        }
    }
}

export default APIError;