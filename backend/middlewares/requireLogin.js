// import  ObjectId  from 'mongoose';
const {ObjectId}=require('mongodb');


const jwt= require( 'jsonwebtoken');
const JWT_SIGNUP_KEY=process.env.JWT_SIGNUP_KEY;
const mongoose=require('mongoose');
const userLogin=require("../models/userSignUp.js");

module.exports= async (req, res, next)=>{
    const {authorization}= req.headers;

    //authorisation === Bearer eqehgjduikd
    if(!authorization){
        return res.status(401).json( {error:"Log In to access the content"})
    }
    const token=authorization.replace("Bearer ","");
    jwt.verify(token, JWT_SIGNUP_KEY, (err, payload)=>{
        if(err){
            return res.status(401).json({error:"Please Log In First!"});
        }
        const {userId}= payload;
        const _id=new ObjectId(userId)
        userLogin.findById(_id).then(userdata=>{
            req.user=userdata;
            next();
        });
    })
}