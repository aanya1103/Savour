const mongoose= require('mongoose');
// const {ObjectId}= mongoose.Schema.Types;
const {ObjectId}=require('mongoose');

const postSchems= new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    },
    photo:{
        type: String,
        require: true
    },
    likes:[{type:mongoose.Schema.Types.ObjectId,ref:'userLoginDetails'}],
    postedBy: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'userLoginDetails',
            required: true
        },
        username: {
            type: String,
            default: "user123",
            required: true
        }
    }
});

module.exports= mongoose.model("userposts",postSchems);