import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import "./VendorReportModal.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";

const generatePDF = async (vendor) => {
  try {
    const response = await axios.get(
      `http://localhost:4000/admin/orders/${vendor}`
    );
    const data1 = response.data;
    console.log(data1);
    const doc = new jsPDF();
    doc.setProperties({
      title: `Payments Report for Vendor`,
    });

    let y = 20;
    doc.setFontSize(18);
    doc.text(`Payments Report for ${vendor}`, 105, y, { align: "center" });
    y += 10;

    const headers = [
      "Order ID",
      "Order Date",
      "Order Items",
      "Total Price",
      "Status",
    ];
    const acceptedData = data1.Aorders.map((payment) => {
      const itemNames = payment.itemNames ? payment.itemNames.join(", ") : ""; // Join itemNames array with commas
      return [
        payment.orderId,
        payment.orderDate,
        itemNames,
        payment.totalPrice,
        payment.status,
      ];
    });

    const placedData = data1.Porders.map((payment) => {
      const itemNames = payment.itemNames ? payment.itemNames.join(", ") : ""; // Join itemNames array with commas
      return [
        payment.orderId,
        payment.orderDate,
        itemNames,
        payment.totalPrice,
        payment.status,
      ];
    });

    const combinedData = [...acceptedData, ...placedData]; // Combine data for both "accepted" and "placed" orders

    doc.autoTable({
      startY: y,
      head: [headers],
      body: combinedData,
    });

    doc.save(`report_${vendor}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};

const VendorReportModal = ({ vendor, orders, onClose }) => {
  const placedOrdersCount = orders.Porders.length;
  const acceptedOrdersCount = orders.Aorders.length;
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
          bgcolor: "whITE",
          boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          border: "none",
          padding: "20px",
          backgroundColor: "black",
          color: "white",
        }}
      >
        <Typography variant="h4" style={{ fontWeight: "bolder" }}>
          Vendor Report
        </Typography>
        <Typography variant="subtitle1">
          Placed Orders: {placedOrdersCount}
        </Typography>
        <Typography variant="subtitle1">
          Accepted Orders: {acceptedOrdersCount}
        </Typography>
        {orders.Porders.length > 0 && (
          <>
            <h5>Placed Orders</h5>
            <table style={{ width: "100%", marginTop: "20px" }}>
              <thead
                style={{ borderCollapse: "collapse", border: "1px solid" }}
              >
                <tr>
                  <th>Order ID</th>
                  <th>Order Date</th>
                  <th>Order Items</th>
                  <th>Total Price</th>
                </tr>
              </thead>
              <tbody
                style={{ borderCollapse: "collapse", border: "1px solid" }}
              >
                {orders.Porders.map((order) => (
                  <tr
                    key={order._id}
                    style={{ borderCollapse: "collapse", border: "1px solid" ,backgroundColor:"black" ,color: "white"  }}
                  >
                    <td
                      style={{
                        borderCollapse: "collapse",
                        border: "1px solid",
                      }}
                    >
                      {order.orderId}
                    </td>
                    <td
                      style={{
                        borderCollapse: "collapse",
                        border: "1px solid",
                      }}
                    >
                      {new Date(order.orderDate).toLocaleString()}
                    </td>
                    <td
                      style={{
                        borderCollapse: "collapse",
                        border: "1px solid",
                      }}
                    >
                      {order.itemNames.map((item) => (
                        <>
                          <p>{item}</p>
                        </>
                      ))}
                    </td>
                    <td
                      style={{
                        borderCollapse: "collapse",
                        border: "1px solid",
                      }}
                    >
                      Rs. {order.totalPrice}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {orders.Aorders.length > 0 && (
          <>
            <h5>Accepted Orders</h5>
            <table style={{ width: "100%", marginTop: "20px" }}>
              <thead
                style={{ borderCollapse: "collapse", border: "1px solid" }}
              >
                <tr>
                  <th>Order ID</th>
                  <th>Order Date</th>
                  <th>Order Items</th>
                  <th>Total Price</th>
                </tr>
              </thead>
              <tbody
                style={{ borderCollapse: "collapse", border: "1px solid" }}
              >
                {orders.Aorders.map((order) => (
                  <tr
                    key={order._id}
                    style={{ borderCollapse: "collapse", border: "1px solid",backgroundColor:"black" ,color: "white"  }}
                  >
                    <td
                      style={{
                        borderCollapse: "collapse",
                        border: "1px solid",
                      }}
                    >
                      {order.orderId}
                    </td>
                    <td
                      style={{
                        borderCollapse: "collapse",
                        border: "1px solid",
                      }}
                    >
                      {new Date(order.orderDate).toLocaleString()}
                    </td>
                    <td
                      style={{
                        borderCollapse: "collapse",
                        border: "1px solid",
                      }}
                    >
                      {order.itemNames.map((item) => (
                        <>
                          <p>{item}</p>
                        </>
                      ))}
                    </td>
                    <td
                      style={{
                        borderCollapse: "collapse",
                        border: "1px solid",
                      }}
                    >
                      Rs. {order.totalPrice}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        {orders.Aorders.length < 1 && orders.Porders.length < 1 && (
          <p>Oops! No order found.</p>
        )}
        {(orders.Aorders.length > 0 || orders.Porders.length > 0) && (
          <Button
            variant="contained"
            onClick={() => generatePDF(vendor)}
            style={{ marginTop: "20px", backgroundColor: "#246e26" }}
          >
            Generate Report
          </Button>
        )}
      </Box>
    </Modal>
  );
};

export default VendorReportModal;
