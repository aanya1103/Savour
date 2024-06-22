// Define the schema for the payment data
const mongoose = require("mongoose");

const paymentvendorSchema = new mongoose.Schema({
  orderId: {
    type:mongoose.Schema.Types.String,
    required: true,
    ref: "orders",
  },
  userId: {
    type: mongoose.Schema.Types.String,
    required: true,
    ref: "orders",
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "orders",
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  receipt:{
    type: String,
    required: true,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
});

// Create a Mongoose model for the payment schema
const Payment = mongoose.model("PaymentVendor", paymentvendorSchema);
module.exports = Payment;
