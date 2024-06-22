//AdminVendorReq.js
import React, { useEffect, useState } from "react";
import "./AdminVendorReq.css";
import VendorDetailsModal from "./VendorDetailsModal";

const VendorRequest = () => {
  const [vendors, setVendors] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [viewModal, setViewModal] = useState(false);

  const getAllVendors = async () => {
    try {
      const resp = await fetch("http://localhost:4000/admin/vrequest", {
        method: "GET",
      });

      const data = await resp.json();
      console.log("Fetched data:", data);
      setVendors(data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getAllVendors();
  }, []);

  const handleEditClick = () => {
    setEditMode(!editMode);
  };

  const handleUserBlockClick = () => {
    setShowButtons(!showButtons);
  };

  const handleTickClick = async (vendorId) => {
    try {
      // Fetch the vendor request data by ID
      const resp = await fetch(
        `http://localhost:4000/admin/vrequest/${vendorId}`,
        {
          method: "GET",
        }
      );
      if (!resp.ok) {
        throw new Error("Failed to fetch vendor request data");
      }
      const requestData = await resp.json();
      console.log("Fetched vendor request data:", requestData);

      // Send the vendor request data to the confirm endpoint
      const confirmResp = await fetch(
        "http://localhost:4000/admin/vrequest/confirm",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData), // Send the fetched data to the confirm endpoint
        }
      );
      if (!confirmResp.ok) {
        throw new Error("Failed to confirm vendor request");
      }
      const confirmData = await confirmResp.json();
      console.log("Confirmed vendor response:", confirmData);

      // After confirmation, update frontend state or UI as needed
      if (confirmData.updatedVendors) {
        setVendors(confirmData.updatedVendors); // Update vendors state if needed
      } else {
        console.error(
          "No 'updatedVendors' property in the response:",
          confirmData
        );
      }
    } catch (error) {
      console.error("Error confirming vendor:", error);
    }
  };

  const handleCrossClick = async (vendorId) => {
    try {
      await fetch("http://localhost:4000/admin/vrequest/reject", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: vendorId }),
      });

      // After rejecting, remove the vendor from the frontend
      setVendors((prevVendors) =>
        prevVendors.filter((vendor) => vendor._id !== vendorId)
      );
    } catch (error) {
      console.error("Error rejecting vendor:", error);
    }
  };

  const handleViewClick = (vendorId) => {
    const selected = vendors.find((vendor) => vendor._id === vendorId);
    if (selected) {
      setSelectedVendor(selected);
      setViewModal(true);
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

  return (
    <div className={`admin-users-container ${editMode ? "edit-mode" : ""}`}>
      <div className="top-bar">
        <button className="edit-button" onClick={handleEditClick}>
          {editMode ? "CANCEL" : "EDIT"}
        </button>
      </div>
      <h1>Vendor Requests</h1>
      {currentVendors && currentVendors.length > 0 ? (
        <div>
          <table className="vendor-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Shop Name</th>
                {editMode && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {currentVendors.map((curVendor, index) => (
                <tr
                  key={index}
                  className={`user-row ${showButtons ? "show-buttons" : ""}`}
                  onClick={handleUserBlockClick}
                >
                  <td>{curVendor.name}</td>
                  <td>{curVendor.shopName}</td>
                  {editMode && (
                    <td className="action-buttons">
                      <button
                        className="tick-button"
                        onClick={() => handleTickClick(curVendor._id)}
                      >
                        ✔
                      </button>
                      <button
                        className="cross-button"
                        onClick={() => handleCrossClick(curVendor._id)}
                      >
                        ×
                      </button>
                      <button
                      className="view-button"
                      onClick={() => handleViewClick(curVendor._id)}
                    >
                      View
                    </button>
                    </td>
                  )}
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
      {viewModal && editMode && (
        <VendorDetailsModal
          vendor={selectedVendor}
          onClose={() => setViewModal(false)}
        />
      )}
    </div>
  );
};

export default VendorRequest;
