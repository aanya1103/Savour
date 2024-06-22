//VendorMenu.js
const mongoose = require("mongoose");

const MenuItemSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "vendorDetails", // Corrected reference name
    required: true,
  },
  item: {
    type: String,
    required: true,
  },
  category:{
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("MenuItem", MenuItemSchema);