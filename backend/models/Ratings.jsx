// Ratings.js 
const mongoose = require("mongoose");

const ratingsSchema = new mongoose.Schema({
  ratings: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    default:" "
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "vendorconfirmeds",
    required: true,
  },
  userId: {
    type: String,
    required: true,
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
});

const Orders = mongoose.model("Ratings", ratingsSchema);
module.exports = Orders;