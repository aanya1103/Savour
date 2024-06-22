import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import "./AllVendorReport.css";
import axios from "axios";
const AllVendorReport = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrdersForAllVendors();
  }, []);

  const fetchOrdersForAllVendors = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/admin/Allvendors"
      );
      const data = response.data; // Assuming data is returned in the same format as provided
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders for all vendors:", error);
    }
  };

  const generatePDF = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/admin/Allvendors"
      );
      const data1 = response.data;
      console.log(data1);
      const doc = new jsPDF();
      doc.setProperties({
        title: `All Vendors Report`,
      });

      let y = 20;
      doc.setFontSize(18);
      doc.text(`All Orders Report`, 105, y, { align: "center" });
      y += 10;

      const headers = [
        "Transaction Date",
        "Vendor Name",
        "UserID",
        "Order ID",
        "Order Date",
        "Order Items",
        "Total Price",
        "Status",
      ];

      const combinedData = [];

      data1.forEach((vendor) => {
        const aorderdate = vendor.Aorders.map((payment) => {
          const date = new Date(payment.orderDate);

          const dd = String(date.getDate()).padStart(2, "0");
          const mm = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based
          const yyyy = date.getFullYear();

          const formattedDate = `${dd}-${mm}-${yyyy}`;
          return formattedDate;
        });

        const apaydate = vendor.Aorders.map((payment) => {
          const date = new Date(payment.paymentDate);

          const dd = String(date.getDate()).padStart(2, "0");
          const mm = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based
          const yyyy = date.getFullYear();

          const formattedDate = `${dd}-${mm}-${yyyy}`;
          return formattedDate;
        });
        const acceptedData = vendor.Aorders.map((payment, index) => {
          const itemNames = payment.itemNames
            ? payment.itemNames.join(", ")
            : "";
          return [
            apaydate[index], // Assuming this is the transaction date for the payment
            vendor.vendorname,
            payment.userId,
            payment.orderId,
            aorderdate[index],
            itemNames,
            payment.totalPrice,
            payment.status,
          ];
        });

        const orderdate = vendor.Porders.map((payment) => {
          const date = new Date(payment.orderDate);

          const dd = String(date.getDate()).padStart(2, "0");
          const mm = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based
          const yyyy = date.getFullYear();

          const formattedDate = `${dd}-${mm}-${yyyy}`;
          return formattedDate;
        });

        const paydate = vendor.Porders.map((payment) => {
          const date = new Date(payment.paymentDate);

          const dd = String(date.getDate()).padStart(2, "0");
          const mm = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based
          const yyyy = date.getFullYear();

          const formattedDate = `${dd}-${mm}-${yyyy}`;
          return formattedDate;
        });

        const placedData = vendor.Porders.map((payment, index) => {
          const itemNames = payment.itemNames
            ? payment.itemNames.join(", ")
            : "";
          return [
            paydate[index], // Assuming this is the transaction date for the payment
            vendor.vendorname,
            payment.userId,
            payment.orderId,
            orderdate[index],
            itemNames,
            payment.totalPrice,
            payment.status,
          ];
        });

        combinedData.push(...acceptedData, ...placedData);
      });

      doc.autoTable({
        startY: y,
        head: [headers],
        body: combinedData,
      });

      doc.save(`Allordersreports.pdf`);
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
            <th>Payment Date</th>
            <th>Vendor ID</th>
            <th>Vendor Name</th>
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
                      <td>{order.paymentDate}</td>
                      <td>{vendorOrders.vendorId}</td>
                      <td>{vendorOrders.vendorname}</td>
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
                      <td>{order.paymentDate}</td>
                      <td>{vendorOrders.vendorId}</td>
                      <td>{vendorOrders.vendorname}</td>
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
              <td colSpan="8">No orders found</td>
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
