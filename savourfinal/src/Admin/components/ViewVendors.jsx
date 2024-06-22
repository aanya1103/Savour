import React, { useEffect, useState } from "react";
import "./ViewVendors.css";
import VendorReportModal from "./VendorReportModal";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

const ViewVendor = () => {
  const [vendors, setVendors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate(); // Get the navigate function from React Router

  const getAllVendors = async () => {
    try {
      setLoading(true);
      const resp = await fetch("http://localhost:5000/admin/vrequest/confirm");
      if (!resp.ok) {
        throw new Error("Failed to fetch vendors");
      }
      const data = await resp.json();
      console.log("Fetched data:", data);
      setVendors(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getAllVendors();
    console.log("Orders updated:", orders);
  }, []);

  const handleVendorClick = async (vendor) => {
    setViewModal(true);
    setSelectedVendor(vendor);
    await fetchOrders(vendor._id);
  };

  const fetchOrders = async (vendorid) => {
    try {
      setLoading(true);
      const resp = await fetch(
        `http://localhost:5000/admin/orders/${vendorid}`
      );
      if (!resp.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await resp.json();
      console.log("Fetched orders:", data);
      setOrders(data); // Assuming the response structure includes an 'orders' key
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching orders:", error);
    }
  };

  const indexOfLastVendor = currentPage * itemsPerPage;
  const indexOfFirstVendor = indexOfLastVendor - itemsPerPage;
  const currentVendors = vendors.slice(indexOfFirstVendor, indexOfLastVendor);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(vendors.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  // Function to handle generating the report and navigating to a new page
  const handleGenerateReport = () => {
    const reportData = {};
    navigate("/admin/reports/vendor/Allvendor", { state: { reportData } }); // Navigate to the "/report" page with reportData in state
  };

  return (
    <div className={`admin-users-container `}>
      <h1>Vendors Information</h1>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {currentVendors && currentVendors.length > 0 ? (
            <div>
              <table className="vendor-table">
                <thead>
                  <tr>
                    <th>Vendor Name</th>
                    <th>Vendor ID</th>
                  </tr>
                </thead>
                <tbody>
                  {currentVendors.map((curVendor, index) => (
                    <tr
                      key={index}
                      onClick={() => handleVendorClick(curVendor)}
                    >
                      <td>{curVendor.name}</td>
                      <td>{curVendor.userid}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="pagination">
                {pageNumbers.map((number) => (
                  <button key={number} onClick={() => paginate(number)}>
                    {number}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p>No vendor found</p>
          )}
          <button className="download-button" onClick={handleGenerateReport}>
            Generate Order Report
          </button>
          {viewModal && (
            <VendorReportModal
              vendor={selectedVendor._id}
              orders={orders}
              onClose={() => setViewModal(false)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ViewVendor;
