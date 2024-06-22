import React, { useEffect, useState } from "react";
import "./AdminUsers.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 6; // Display 7 items per page

  useEffect(() => {
    const getAllUserData = async () => {
      try {
        const resp = await fetch("http://localhost:4000/admin/users", {
          method: "GET",
        });

        const data = await resp.json();
        console.log("Fetched data:", data);
        setUsers(data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    getAllUserData();
  }, []);

  const handleEditClick = () => {
    setEditMode(!editMode);
    if (!editMode) {
      setShowButtons(false); // Hide buttons when switching to edit mode
    }
  };

  const handleUserBlockClick = () => {
    if (editMode) {
      setShowButtons(!showButtons);
    }
  };

  const handleDeleteUser = async (_id) => {
    try {
      const resp = await fetch(`http://localhost:4000/admin/users/${_id}`, {
        method: "DELETE",
      });

      if (resp.ok) {
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== _id));
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter((user) =>
    user.userid.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate the index range for users to display on the current page
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUserPage = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Pagination logic
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredUsers.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value); // Update search term state on input change
    setCurrentPage(1); // Reset pagination to first page on search
  };

  return (
    <div className={`admin-users-container ${editMode ? "edit-mode" : ""}`}>
      <div className="top-bar">
        <button className="edit-button" onClick={handleEditClick}>
          {editMode ? "CANCEL" : "EDIT"}
        </button>
      </div>
      <h1>Users</h1>
      <input
        type="text"
        placeholder="Search by user name"
        value={searchTerm}
        onChange={handleSearchChange}
      />

      {currentUserPage && currentUserPage.length > 0 ? (
        currentUserPage.map((curUser, index) => (
          <div
            key={index}
            className={`user-block ${showButtons && editMode ? "show-buttons" : ""}`}
            onClick={handleUserBlockClick}
          >
            {curUser.userid}
            {editMode && showButtons && (
              <div className="action-buttons">
                <button
                  className="cross-button"
                  onClick={() => handleDeleteUser(curUser._id)}
                >
                  ×
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No matched user found</p>
      )}
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

export default AdminUsers;
