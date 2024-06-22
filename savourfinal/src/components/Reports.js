import React from "react";
import { Link } from "react-router-dom";
import "./Reports.css"; // Import the CSS file for styling

const ViewReports = () => {
  return (
    <div className="view-reports-container">
      <h1 className="heading">View Reports</h1>
      <div className="options">
        <Link to="/admin/reports/vendor" className="report-option">
          Generate Report of Vendor
        </Link>
        <Link to="/admin/reports/user" className="report-option">
          Generate Report of User
        </Link>
      </div>
    </div>
  );
};

export default ViewReports;
