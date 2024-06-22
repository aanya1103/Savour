const mongoose=require('mongoose');

const URI=process.env.MONGO_URI;
const connectDB= async()=>{
    try{
        await mongoose.connect("mongodb+srv://sahniharsha2505:aanyaharsha2511@cluster0.sqbpabc.mongodb.net/Savour?retryWrites=true&w=majority");
        console.log("Connection Successful");
    }catch(error){
        console.error(error);
        process.exit(0);
    }
}
module.exports= connectDB;