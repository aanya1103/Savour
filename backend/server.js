require("dotenv").config({ path: "./utils/.env" });
const cors = require("cors");
const Payment = require("./models/Payment.js");
const express = require("express");
const app = express();
const connectDB = require("./utils/configuration");
const router = require("./routers/allRoutes");
const errorMiddleware = require("./middlewares/error-middleware");
const Razorpay = require("razorpay");
const crypto= require("crypto");

const bodyParser = require("body-parser");
const adminRoute = require("./routers/adminrouter.js");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use("/api/auth", router);
app.use("/admin", adminRoute);
app.use(errorMiddleware);
app.use(bodyParser.json());

//Aanya
const PORT = process.env.PORT;
app.post("/api/auth/transaction", async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = req.body;
    const order = await razorpay.orders.create(options);
    console.log("HII HELLO");
    console.log(order);
    console.log("HII HELLO");

    if (!order) {
      return res.status(500).send("Error creating order");
    }
    res.json(order);
  } catch (error) {
    res.status(500).send("Error creating order");
    console.log(error);
  }
});

// Route to validate transaction payment
app.post("/api/auth/transaction/validate", async (req, res) => {
  console.log("In the backend");
  console.log(req.body);
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    amount,
    currency,
    receipt,
    userId,
    vendorId,
    orderId,
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Database operation
    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount:amount/100,
      currency,
      receipt,
      userId,
      vendorId,
      orderId,
    });
    res.status(200).json({ success: true });
  } else {
    res.status(400).json({
      success: false,
      message: "Invalid signature",
    });
  }
});
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server running on port 5000");
  });
});