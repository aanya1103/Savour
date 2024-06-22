const mongoose= require('mongoose');
const userLoginSchema = new mongoose.Schema(
    {
        userid: { type: String, required: true},
        password: { type: String, required:true}
    }
);
module.exports= mongoose.model('userLoginDetails',userLoginSchema,'userLoginDetails')