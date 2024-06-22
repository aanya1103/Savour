const errorMiddleware=(err, req, resp, next)=>{
    const status= err.status || 500;
    const message= err.message || "BACKEND ERROR";
    const extraDetails= err.extraDetails || "Error from Backend";

    return resp.status(status).json({message, extraDetails});
};

module.exports= errorMiddleware;