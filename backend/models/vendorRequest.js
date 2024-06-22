//vendorDetails.jsx
const mongoose = require("mongoose");
// const {ObjectId}= mongoose.Schema.Types;
const { ObjectId } = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const vendorSchems = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  shopName: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    require: true,
  },
  alternateContact: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  numberOfEmployees: {
    type: String,
    require: true,
  },
  age: {
    type: String,
    require: true,
  },
  adharNumber: {
    type: String,
    require: true,
  },
  panCard: {
    type: String,
    require: true,
  },
  location: {
    type: String,
    require: true,
  },
  startTime: {
    type: String,
    require: true,
  },
  endTime: {
    type: String,
    require: true,
  },
  photograph: {
    type: String,
    require: true,
  },
  certificate: {
    type: String,
    require: true,
  },
  userid: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  bankName: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,
  },
  ifscCode: {
    type: String,
    required: true,
  },
});

vendorSchems.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) {
    next();
  }
  try {
    const saltRound = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(user.password, saltRound);
    user.password = hash_password;
  } catch (error) {
    next(error);
  }
});

//json web token -always stored on browser side and not server side
vendorSchems.methods.generateToken = async function () {
  try {
    return jwt.sign(
      {
        userid: this._id.toString(),
        email: this.email,
      },
      process.env.JWT_SIGNUP_KEY,
      {
        expiresIn: "100d",
      }
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = mongoose.model("vendorrequests", vendorSchems);
