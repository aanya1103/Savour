const mongoose= require('mongoose');
const bcrypt= require('bcryptjs');
const jwt= require("jsonwebtoken");
const crypto = require("crypto");

const userSignUpSchema = new mongoose.Schema(
    {
        userid: { type: String, required: true, unique: true},
        email: { type: String, required: true, unique: true},
        contact: { type: String, required: true},
        password: { type: String, required:true},
        houseNo: { type: String},
        state: { type: String},
        city: { type: String},
        locality: { type: String},
        passwordChangedAt: {
            // unselect
            type: Date,
          },
          passwordResetToken: {
            // unselect
            type: String,
          },
          passwordResetExpires: {
            // unselect
            type: Date,
          },
          createdAt: {
            type: Date,
            default: Date.now(),
          },
          updatedAt: {
            // unselect
            type: Date,
          },
          verified: {
            type: Boolean,
            default: false,
          },
          otp: {
            type: String,
          },
          otp_expiry_time: {
            type: Date,
          }
    }
);

// userSignUpSchema.pre('save', async function(next){
//     const user= this;
//     if(!user.isModified("password")){
//         next();
//     }
//     try{
//         const saltRound = await bcrypt.genSalt(10);
//         const hash_password= await bcrypt.hash(user.password, saltRound);
//         user.password=hash_password;
//     }catch(error)
//     {
//         next(error);
//     }
// });


//json web token -always stored on browser side and not server side
userSignUpSchema.methods.generateToken= async function(){
    try{
        return jwt.sign({
            userid: this._id.toString(),
            email: this.email,
            isAdmin : this.isAdmin
        },
        process.env.JWT_SIGNUP_KEY,
        {
            expiresIn: "30d",
        }
        );
    }catch(error){
        console.log(error);
    }
};

//new added 
userSignUpSchema.pre("save", async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified("otp") || !this.otp) return next();
  
    // Hash the otp with cost of 12
    this.otp = await bcrypt.hash(this.otp.toString(), 12);
  
    console.log(this.otp.toString(), "FROM PRE SAVE HOOK");
  
    next();
  });
  
  userSignUpSchema.pre("save", async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified("password") || !this.password) return next();
  
    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
  
    //! Shift it to next hook // this.passwordChangedAt = Date.now() - 1000;
  
    next();
  });
  
  userSignUpSchema.pre("save", function (next) {
    if (!this.isModified("password") || this.isNew || !this.password)
      return next();
  
    this.passwordChangedAt = Date.now() - 1000;
    next();
  });
  
  userSignUpSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
  ) {
    return await bcrypt.compare(candidatePassword, userPassword);
  };
  
  
  userSignUpSchema.methods.correctOTP = async function (candidateOTP, userOTP) {
    return await bcrypt.compare(candidateOTP, userOTP);
  };
  
  userSignUpSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
    if (this.passwordChangedAt) {
      const changedTimeStamp = parseInt(
        this.passwordChangedAt.getTime() / 1000,
        10
      );
      return JWTTimeStamp < changedTimeStamp;
    }
  
    // FALSE MEANS NOT CHANGED
    return false;
  };
  
  userSignUpSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
  
    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
  
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  
    return resetToken;
  };
  
  

module.exports= mongoose.model('userlogindetails',userSignUpSchema);