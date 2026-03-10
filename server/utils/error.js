export const errorHandler=(statusCode,message)=>{
    const error= new Error();
    error.success=false;
    error.statusCode=statusCode;
    error.message=message;
    return error;
    }