import React, { useState, useEffect } from "react";
import "./DisplayConfirmedVendors.css";
import { Link } from "react-router-dom";

const ConfirmedVendor = () => {
  const [confirmedVendors, setConfirmedVendors] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const itemsPerPage = 5; // Change the number of items per page as needed

  const handleDeleteAllClick = async () => {
    try {
      await fetch("http://localhost:5000/admin/vrequest/confirm/deleteAll", {
        method: "DELETE",
      });

      setConfirmedVendors([]); // Clear the state to update the UI
    } catch (error) {
      console.error("Error deleting all vendors:", error);
    }
  };

  const getConfirmedVendors = async () => {
    try {
      const resp = await fetch("http://localhost:5000/admin/vrequest/confirm", {
        method: "GET",
      });

      const data = await resp.json();
      console.log("Fetched data:", data);
      setConfirmedVendors(data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getConfirmedVendors();
  }, []);

  const handleEditClick = () => {
    setEditMode(!editMode);
  };

  const handleDeleteClick = async (id) => {
    try {
      await fetch(`http://localhost:5000/admin/vrequest/confirm`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      });

      setConfirmedVendors((prevVendors) =>
        prevVendors.filter((vendor) => vendor._id !== id)
      );
    } catch (error) {
      console.error("Error deleting vendor:", error);
    }
  };

  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value); // Update search term state on input change
  };
  // Filter vendors based on search term
  const filteredVendors = confirmedVendors.filter((vendor) =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate the index range for vendors to display on the current page
  const indexOfLastVendor = currentPage * itemsPerPage;
  const indexOfFirstVendor = indexOfLastVendor - itemsPerPage;
  const currentVendorPage = filteredVendors.slice(indexOfFirstVendor, indexOfLastVendor);

  // Pagination logic
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredVendors.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="app-container">
      <div className="top-button">
        {editMode && (
          <button className="delete-all-button" onClick={handleDeleteAllClick}>
            DELETE ALL
          </button>
        )}
        <button className="edit-button" onClick={handleEditClick}>
          {editMode ? "CANCEL" : "EDIT"}
        </button>
      </div>
      <h1>Confirmed Vendor</h1>
      <div className="search-bar">
        <div className="search-input">
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <table className="vendor-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Shop Name</th>
            {editMode && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(currentVendorPage) && currentVendorPage.length > 0 ? (
            currentVendorPage.map((vendor) => (
              <tr key={vendor._id}>
                <td>{vendor.name}</td>
                <td>{vendor.shopName}</td>
                {editMode && (
                  <td className="actions-container">
                    <Link
                      to={`/admin/vrequest/confirm/${vendor._id}`}
                      className="update-link"
                    >
                      Update
                    </Link>
                    <button onClick={() => handleDeleteClick(vendor._id)}>
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>No confirmed vendors found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={currentPage === number ? "active" : ""}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ConfirmedVendor;
