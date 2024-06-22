const validate= (schema)=>async (req, resp, next)=>{
    try{
        const parseBody= await schema.parseAsync(req.body);
        req.body= parseBody;
        next();
    }catch(err){
        
        if (err.errors && err.errors.length > 0) {
            message = err.errors[0].message;
        }
        const status= 422;
        const error={
            status, message
        };
        console.log(err);
        next(error);
    }
};

module.exports= validate;