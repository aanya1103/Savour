// admincontroller.js
const Vmodel = require("../models/vendorRequest");
const Vconfirmed = require("../models/vendorDetails");
const User = require("../models/userSignUp");
const Order = require("../models/Order.jsx");
const VendorMenu = require("../models/VendorMenu");
const Payment = require("../models/PaymentToVendor");
const PaymentToVendor = require("../models/Payment");
const Post = require("../models/posts.js");
const Vreq = async (req, resp, next) => {
  try {
    const vendor = await Vmodel.find();
    if (!vendor || vendor.length === 0) {
      return resp.status(404).json({ message: "No user Found" });
    }
    return resp.status(200).json(vendor);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getConfirmedVendor = async (req, resp, next) => {
  try {
    const vendor = await Vconfirmed.find();
    if (!vendor || vendor.length === 0) {
      return resp.status(404).json({ message: "No confirmed vendor Found" });
    }
    return resp.status(200).json(vendor);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const AllUsers = async (req, resp) => {
  try {
    const users = await User.find();
    if (!users || users.length === 0) {
      return resp.status(404).json({ message: "No user Found" });
    }
    return resp.status(200).json(users);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const confirmVrequest = async (req, resp, next) => {
  const requestData = req.body;
  console.log("Request Data:", requestData);
  console.log("byi from confirmvreq");
  try {
    // Create a new confirmed vendor instance
    const confirmedVendor = new Vconfirmed(requestData);
    // Save the confirmed vendor to the database
    await confirmedVendor.save();
    console.log("Confirmed vendor:", confirmedVendor);

    // Remove the vendor from the Vmodel collection
    const deletedRequest = await Vmodel.findByIdAndDelete(requestData._id); // Assuming _id is the ID field
    if (!deletedRequest) {
      return resp.status(404).json({ message: "Vendor request not found" });
    }
    console.log("Deleted Request:", deletedRequest);

    // Fetch updated vendors after deletion
    const updatedVendors = await Vmodel.find();
    resp.status(200).json({
      message: "Vendor request confirmed and moved to confirmed vendors",
      updatedVendors,
    });
    console.log("byi from confirmed vendor");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const searchConfirmedVendors = async (req, resp, next) => {
  const { searchTerm } = req.query; // Assuming searchTerm is passed as a query parameter
  try {
    const filteredVendors = await Vconfirmed.find({
      name: { $regex: new RegExp(searchTerm, "i") }, // Case-insensitive search
    });
    resp.status(200).json(filteredVendors);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const searchUsers = async (req, res, next) => {
  const { searchTerm } = req.query;
  console.log("Received search term:", searchTerm); // Add this line for debugging
  try {
    const filteredUsers = await User.find({
      userid: { $regex: new RegExp(searchTerm, "i") },
    });
    console.log("Filtered users:", filteredUsers); // Add this line for debugging

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getVendorConfirmed = async (req, resp) => {
  try {
    console.log("hii from getvendorid");
    const id = req.params.id;
    const data = await Vconfirmed.findById(id);
    if (!data) {
      return resp.status(404).json({ message: "Vendor request not found" });
    }
    console.log(data);
    console.log("byi from getvendorid");
    return resp.status(200).json(data);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getVendorReq = async (req, resp, next) => {
  try {
    console.log("hii from getvendorid");
    const id = req.params.id;
    const data = await Vmodel.findById(id);
    if (!data) {
      return resp.status(404).json({ message: "Vendor request not found" });
    }
    console.log(data);
    console.log("byi from getvendorid");
    return resp.status(200).json(data);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const updateConfirmedVendor = async (req, resp) => {
  try {
    const id = req.params.id;
    const updatedVendorData = req.body;
    console.log(updatedVendorData);
    const updateVendor = await Vconfirmed.updateOne(
      { _id: id }, // Change this to { id: id }
      { $set: updatedVendorData },
      { new: true }
    );
    return resp.status(200).json(updateVendor);
  } catch (error) {
    next(error);
  }
};

const deleteAllConfirmedVendors = async (req, res, next) => {
  try {
    // Fetch all vconfirmed vendors
    const vconfirmedVendors = await Vconfirmed.find({}, '_id');
    // Extract IDs from fetched vendors
    const vendorIds = vconfirmedVendors.map(vendor => vendor._id);
    // Delete confirmed vendors
    await Vconfirmed.deleteMany({});
    // Delete vendor menus
    await VendorMenu.deleteMany({});
    // Delete orders
    await Order.deleteMany({});
    // Delete posts where postedBy.id matches the vendorIds
    await Post.deleteMany({ "postedBy.id": { $in: vendorIds } });
    res.status(200).json({ message: "All confirmed vendors deleted successfully" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};


const rejectVrequest = async (req, resp, next) => {
  const requestId = req.body.id;
  try {
    await Vmodel.findByIdAndDelete(requestId);
    await resp.status(200).json({ message: "Vrequest rejected and deleted" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const deleteConfirmedVendor = async (req, res, next) => {
  const vid = req.body.id;
  try {
    // Delete vendor from Vconfirmed
    await Vconfirmed.findByIdAndDelete(vid);
    await VendorMenu.deleteMany({ vendorId: vid });
    await Order.deleteMany({ vendorId: vid });
    await Post.deleteMany({"postedBy.id":vid});
    res.status(200).json({ message: "Confirmed vendor deleted successfully" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const DeleteUser = async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    const userId = await User.find({userId:req.params.id});
    await Order.deleteMany({ userId:userId });
    await Post.deleteMany({"postedBy.id":req.params.id});
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getVendorOrders = async (req, res) => {
  const { vendorId } = req.params;
  try {
    let Aaorders = [],
      Pporders = [];
    Aaorders = await Order.find({ vendorId, status: "delivered" }).sort({
      orderDate: -1,
    });
    const Aorders = await Promise.all(
      Aaorders.map(async (order) => {
        const itemNames = await Promise.all(
          order.itemId.map(async (itemId) => {
            const item = await VendorMenu.findById(itemId);
            return item ? item.item : null;
          })
        );
        return { ...order._doc, itemNames };
      })
    );

    Pporders = await Order.find({ vendorId, status: "completed" }).sort({
      orderDate: -1,
    });
    const Porders = await Promise.all(
      Pporders.map(async (order) => {
        const itemNames = await Promise.all(
          order.itemId.map(async (itemId) => {
            const item = await VendorMenu.findById(itemId);
            return item ? item.item : null;
          })
        );
        return { ...order._doc, itemNames };
      })
    );

    res.status(200).json({ Aorders: Aorders, Porders: Porders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch vendor orders." });
  }
};

const getAllVendorsOrders = async (req, res) => {
  try {
    const allVendors = await Vconfirmed.find();
    const allOrders = await Promise.all(
      allVendors.map(async (vendor) => {
        const vendorId = vendor._id;
        const vendorname = vendor.name;

        // Fetch both paid and delivered orders for the vendor
        const [Aorders, Porders] = await Promise.all([
          Order.find({ vendorId, status: "completed" }).sort({ orderDate: -1 }),
          Order.find({ vendorId, status: "delivered" }).sort({ orderDate: -1 }),
        ]);

        // Map over Aorders and Porders simultaneously to process them together
        const [formattedAorders, formattedPorders] = await Promise.all([
          processOrders(Aorders),
          processOrders(Porders),
        ]);

        return {
          vendorId,
          vendorname,
          Aorders: formattedAorders,
          Porders: formattedPorders,
        };
      })
    );

    // Filter out vendors without any orders
    const nonEmptyOrders = allOrders.filter(
      (order) => order.Aorders.length > 0 || order.Porders.length > 0
    );
    res.status(200).json(nonEmptyOrders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch all vendors orders." });
  }
};

// Function to process orders and fetch item names and payment dates
const processOrders = async (orders) => {
  const formattedOrders = await Promise.all(
    orders.map(async (order) => {
      const itemNames = await Promise.all(
        order.itemId.map(async (itemId) => {
          const item = await VendorMenu.findById(itemId);
          return item ? item.item : null;
        })
      );

      // Fetch paymentDate from Payment if status is 'delivered'
      let paymentDate = null;
      if (order.status === "delivered") {
        const payment = await PaymentToVendor.findOne({
          orderId: order.orderId,
        });
        paymentDate = payment ? payment.paymentDate : null;
        console.log("DELIVERED", order.orderId);
      } else if (order.status === "completed") {
        const payment = await Payment.findOne({
          orderId: order.orderId,
        });
        paymentDate = payment ? payment.paymentDate : null;
        console.log("COMPLETED", order.orderId);
      }

      return { ...order._doc, itemNames, paymentDate };
    })
  );

  // Exclude orders with no item names
  return formattedOrders.filter((order) => order.itemNames.length > 0);
};

const getpaidvendors = async (req, res) => {
  try {
    // Fetch orders with status 'delivered' and select vendorId and orderId
    const orders = await Order.find({ status: "delivered" }).select(
      "vendorId orderId totalPrice"
    );

    // Extract vendor IDs and order IDs from orders
    const vendorIds = orders.map((order) => order.vendorId);

    // Fetch vendor names from Vconfirmeds using vendor IDs
    const vendors = await Vconfirmed.find({ _id: { $in: vendorIds } }).select(
      "name"
    );

    // Create an array of objects with vendor ID, vendor name, and order ID
    const data = orders.map((order) => ({
      vendorId: order.vendorId,
      vendorName: vendors.find(
        (vendor) => vendor._id.toString() === order.vendorId.toString()
      ).name,
      orderId: order.orderId,
      totalPrice: order.totalPrice,
    }));

    res.json(data);
    console.log(data); // Send the vendor ID, vendor name, and order ID in the response
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getVendorOrder = async (req, res) => {
  const { orderId, vendorId } = req.body; // Assuming orderId and vendorId are passed in body
  try {
    // Fetch the order by orderId using the Order model
    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }
    const userid = order.userId;
    // Fetch item details (name, category, etc.) for each itemId in the order
    const itemNames = [];
    const itemId = [];
    for (let i = 0; i < order.itemId.length; i++) {
      const item = await VendorMenu.findById(order.itemId[i]);
      if (!item) {
        itemNames.push("Item not found");
        itemId.push("dsgf");
      } else {
        itemNames.push(item.item);
        itemId.push(item._id); // Push item name to itemNames array
      }
    }
    const vendorDetails = await Vconfirmed.findOne({ _id: vendorId });
    // Fetch vendor bank details from vendorconfirmends table using vendorId
    if (!vendorDetails) {
      return res.status(404).json({ error: "Vendor details not found." });
    }

    const { bankName, ifscCode, accountNumber, name } = vendorDetails; // Destructure bank details

    // Construct the response object with required data
    const responseData = {
      itemNames: itemNames.join(", "),
      itemId: itemId.join(" ,"), // Combine item names with commas
      bankName,
      userid,
      ifscCode,
      accountNumber,
      name,
      totalPrice: order.totalPrice,
      vendorId, // Fetch total price from the order
    };

    res.status(200).json(responseData);
    console.log(responseData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch order data." });
  }
};

const processPayment = async (req, res) => {
  try {
    const { orderId, userId, vendorId, amount, currency, receipt } = req.body;
    console.log("BODY ", req.body);

    // Create a new payment record
    const payment = new Payment({
      orderId, // Assuming orderId is a string type
      userId,
      vendorId,
      amount,
      currency,
      receipt,
    });

    // Save the payment record
    await payment.save();

    const updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      { status: "completed" }
    );

    if (!updatedOrder) {
      throw new Error("Order not found for orderId: " + orderId);
    }

    res.status(200).json({ message: "Payment successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  Vreq,
  AllUsers,
  rejectVrequest,
  getConfirmedVendor,
  deleteConfirmedVendor,
  getVendorReq,
  getVendorConfirmed,
  updateConfirmedVendor,
  deleteAllConfirmedVendors,
  confirmVrequest,
  DeleteUser,
  searchConfirmedVendors,
  searchUsers,
  getVendorOrders,
  getAllVendorsOrders,
  getpaidvendors,
  getVendorOrder,
  processPayment,
};
