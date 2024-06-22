// Orders.js 
const mongoose = require("mongoose");

const ordersSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    required: true
  },
  itemId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "menuitems",
    required: true,
  }],
  price: [{
    type: Number,
    required: true,
  }],
  qty: [{
    type: Number,
    required: true,
  }],
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "vendorconfirmeds",
    // required: true,
  },
  userId: {
    type: mongoose.Schema.Types.String,
    ref:"userlogindetails",
    required: true,
  },
  status:{
    type: String,
    required:true,
    default: "pending",
  },
  totalPrice: {
    type: Number, // Total price field added here
    required: true,
    default:0,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  orderTime: {
    type: String,
    default: () => {
      const currentTime = new Date();
      return `${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`;
    },
  },
  houseNo:{
    type: String,
    required:true,
  },
  city:{
    type: String,
    required:true,
  },
  state:{
    type: String,
    required:true,
  },
  locality:{
    type: String,
    required:true,
  },
  otp: {
    type: Number, 
  },
});

const Orders = mongoose.model("Orders", ordersSchema);
module.exports = Orders;