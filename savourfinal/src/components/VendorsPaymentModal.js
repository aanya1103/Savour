import React, { useState, useEffect } from "react";
import { Modal, Button, Typography, Box } from "@mui/material";
import Swal from "sweetalert2";

const VendorsPaymentModal = ({ vendor, onClose }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/admin/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: vendor.orderId,
            vendorId: vendor.vendorId,
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to fetch order details.");
        }
        const data = await response.json();
        console.log("Response data:", data);
        setOrder(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    if (vendor) {
      fetchOrderDetails();
    }
  }, [vendor]);

  // Function to handle pay button click
  const handlePayClick = async () => {
    try {
      const response = await fetch(`http://localhost:4000/admin/payout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: vendor.orderId,
          userId: order.userId, // Corrected from order.userid to order.userId
          vendorId: vendor.vendorId,
          amount: order.totalPrice,
          currency: "INR", // Assuming the currency is INR
          receipt: "receipt_" + vendor.orderId, // Generate receipt ID
        }),
      });
      if (!response.ok) {
        throw new Error("Payment failed.");
      }
      const responseData = await response.json();
      console.log("Payment response:", responseData);

      // Show success message using SweetAlert
      Swal.fire({
        icon: "success",
        title: "Payment Successful",
        text: "Your payment has been processed successfully.",
      }).then(() => {
        onClose(); // Close modal after SweetAlert is closed
      });
    } catch (error) {
      console.error(error);
      // Handle payment failure
      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: "There was an error processing your payment. Please try again later.",
      });
    }
  };

  return (
    <Modal open={true} onClose={onClose} aria-labelledby="vendor-report-modal">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 700,
          maxHeight: "80vh", // Set maximum height to 90% of viewport height
          overflowY: "auto", // Enable vertical scrolling when content exceeds maxHeight
          bgcolor: "white",
          boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          border: "none",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h5" style={{ marginBottom: "20px" }}>
          Order Details for {vendor.orderId}
        </Typography>
        {loading ? (
          <Typography variant="body1">Loading order details...</Typography>
        ) : (
          <>
            <Typography variant="body1">
              <strong>Order ID:</strong> {vendor.orderId}
            </Typography>
            <Typography variant="body1">
              <strong>Vendor ID:</strong> {vendor.vendorId}
            </Typography>
            <Typography variant="body1">
              <strong>Order Items:</strong> {order.itemNames}
            </Typography>
            <Typography variant="body1">
              <strong>Amount:</strong> Rs. {order.totalPrice}
            </Typography>
          </>
        )}
        <Box
          sx={{
            display: "flex",
            marginTop: "20px",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handlePayClick}
            style={{ marginRight: "10px" }}
          >
            Pay Now
          </Button>
          <Button
            variant="outlined"
            onClick={onClose}
            style={{ marginLeft: "10px" }}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default VendorsPaymentModal;
