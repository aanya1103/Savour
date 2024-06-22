// adminrouter.js
const express = require("express");
const acontroller = require("../controllers/admincontroller");
const adminRoute = express.Router();

adminRoute.route("/vrequest").get(acontroller.Vreq);
adminRoute.route("/users").get(acontroller.AllUsers);
adminRoute.route("/users/:id").delete(acontroller.DeleteUser);

adminRoute
  .route("/vrequest/confirm")
  .post(acontroller.confirmVrequest)
  .delete(acontroller.deleteConfirmedVendor)
  .get(acontroller.getConfirmedVendor);

adminRoute.get("/vrequest/:id", acontroller.getVendorReq);
adminRoute.get("/vrequest/confirm/:id", acontroller.getVendorConfirmed);
adminRoute
  .route("/vrequest/confirm/:id/update")
  .patch(acontroller.updateConfirmedVendor);
adminRoute
  .route("/vrequest/confirm/deleteAll")
  .delete(acontroller.deleteAllConfirmedVendors);

adminRoute.route("/payment").get(acontroller.getpaidvendors);
adminRoute.route("/orders").post(acontroller.getVendorOrder);

adminRoute.route("/vrequest/reject").delete(acontroller.rejectVrequest);
adminRoute.route("/orders/:vendorId").get(acontroller.getVendorOrders);
adminRoute.route("/Allvendors").get(acontroller.getAllVendorsOrders);
adminRoute.route("/payout").post(acontroller.processPayment);
module.exports = adminRoute;
