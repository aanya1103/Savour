// Define the schema for the payment data
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.String,
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
  razorpay_order_id: {
    type: String,
    required: true,
  },
  razorpay_payment_id: {
    type: String,
    required: true,
  },
  razorpay_signature: {
    type: String,
    required: true,
  },
});

// Create a Mongoose model for the payment schema
const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;