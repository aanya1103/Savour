import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import "./AllVendorReport.css";

const AllVendorReport = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrdersForAllVendors();
  }, []);

  const fetchOrdersForAllVendors = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/admin/Allvendors"
      );
      const data = response.data; // Assuming data is returned in the same format as provided
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders for all vendors:", error);
    }
  };

  const generatePDF = async (vendor) => {
    try {
      const response = await axios.get(`http://localhost:4000/admin/Allvendors`);
      const data1 = response.data;
      console.log(data1);
      const doc = new jsPDF();
      doc.setProperties({
        title: `All Vendors Report`,
      });
  
      let y = 20;
      doc.setFontSize(18);
      doc.text(`All Vendors Report`, 105, y, { align: "center" });
      y += 10;
  
      const headers = [
        "VendorId",
        "UserID",
        "Order ID",
        "Order Date",
        "Order Items",
        "Total Price",
        "Status",
      ];
  
      const acceptedData = data1.Aorders.map((payment) => {
        const itemNames = payment.itemNames ? payment.itemNames.join(", ") : "";
        return [
          data1.vendorId,
          payment.userId,
          payment.orderId,
          payment.orderDate,
          itemNames,
          payment.totalPrice,
          payment.status,
        ];
      });
  
      const placedData = data1.Porders.map((payment) => {
        const itemNames = payment.itemNames ? payment.itemNames.join(", ") : "";
        return [
          data1.vendorId,
          payment.userId,
          payment.orderId,
          payment.orderDate,
          itemNames,
          payment.totalPrice,
          payment.status,
        ];
      });
  
      const combinedData = [...acceptedData, ...placedData];
  
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
  
  return (
    <div className="view-reports-container">
      <h1 className="heading">All Vendors Report</h1>
      <table>
        <thead>
          <tr>
            <th>Vendor ID</th>
            <th>User ID</th>
            <th>Order Date</th>
            <th>Order ID</th>
            <th>Order Items</th>
            <th>Total Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders && orders.length > 0 ? (
            orders.map((vendorOrders) => (
              <React.Fragment key={vendorOrders.vendorId}>
                {vendorOrders.Aorders &&
                  vendorOrders.Aorders.length > 0 &&
                  vendorOrders.Aorders.map((order) => (
                    <tr key={order._id}>
                      <td>{vendorOrders.vendorId}</td>
                      <td>{order.userId}</td>
                      <td>{order.orderDate}</td>
                      <td>{order.orderId}</td>
                      <td>{order.itemNames.join(", ")}</td>
                      <td>{order.totalPrice}</td>
                      <td>{order.status}</td>
                    </tr>
                  ))}
                {vendorOrders.Porders &&
                  vendorOrders.Porders.length > 0 &&
                  vendorOrders.Porders.map((order) => (
                    <tr key={order._id}>
                      <td>{vendorOrders.vendorId}</td>
                      <td>{order.userId}</td>
                      <td>{order.orderDate}</td>
                      <td>{order.orderId}</td>
                      <td>{order.itemNames.join(", ")}</td>
                      <td>{order.totalPrice}</td>
                      <td>{order.status}</td>
                    </tr>
                  ))}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan="7">No orders found</td>
            </tr>
          )}
        </tbody>
      </table>
      <button
        className="generate-pdf-btn"
        onClick={() => generatePDF("all_vendors")}
      >
        Generate PDF
      </button>
    </div>
  );
};

export default AllVendorReport;
