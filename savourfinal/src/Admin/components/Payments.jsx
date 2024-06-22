import React, { useEffect, useState } from "react";
import "./ViewVendors.css";
import VendorsPaymentsModal from "./VendorsPaymentModal"; // Import VendorDetailsModal
import { CircularProgress } from "@mui/material";
import axios from 'axios';
const Payments = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [viewModal, setViewModal] = useState(false);

  const getVendorsWithPaidOrders = async () => {
    try {
      setLoading(true);
      const resp = await axios.get("http://localhost:5000/admin/payment"); // Endpoint to fetch vendors with paid orders
      setVendors(resp.data); // Assuming resp.data contains vendor details including vendorId, name, etc.
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching vendors with paid orders:", error);
    }
  };

  useEffect(() => {
    getVendorsWithPaidOrders();
  }, []);

  const handleVendorClick = async (vendor) => {
    setViewModal(true);
    console.log(vendor);
    setSelectedVendor(vendor); // Fetch order details using vendorId from vendor object
  };

  return (
    <div className={`admin-users-container `}>
      <h1>Vendors with Due Payments</h1>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {vendors && vendors.length > 0 ? (
            <div>
              <table className="vendor-table">
                <thead>
                  <tr>
                    <th>Vendor ID</th>
                    <th>Vendor Name</th>
                    <th>Order ID</th>
                    <th>Total  Price (Rs.)</th>
                    <th>Vendor's Income (Rs.)</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map((vendor, index) => (
                    <tr key={index} onClick={() => handleVendorClick(vendor)}>
                      <td>{vendor.vendorId}</td>
                      <td>{vendor.vendorName}</td>
                      <td>{vendor.orderId}</td>
                      <td>{vendor.totalPrice}</td>
                      <td>{vendor.totalPrice-vendor.totalPrice*(5/100)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No vendors with paid orders found</p>
          )}
          {viewModal && (
            <VendorsPaymentsModal
              vendor={selectedVendor} // Pass selectedVendor directly
              onClose={() => setViewModal(false)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Payments;
