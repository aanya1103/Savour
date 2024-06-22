import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";


const VendorDetailsModal = ({ vendor, onClose }) => {
  const openCertificate = (certificateUrl) => {
    window.open(certificateUrl, "_blank");
  };

  return (
    <Modal
      open={!!vendor}
      onClose={onClose}
      aria-labelledby="vendor-details-modal"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          maxHeight: "90vh", // Set maximum height to 90% of viewport height
          overflowY: "auto", // Enable vertical scrolling when content exceeds maxHeight
          bgcolor: "white",
          boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          borderRadius: "10px",
          padding: "20px",
        }}
      >
        {vendor && (
          <>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <img
                src={vendor.photograph}
                alt="Photograph"
                style={{
                  width: "150px", // Definite width for photograph
                  height: "150px", // Definite height for photograph
                  borderRadius: "50%",
                  boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.2)",
                }}
              />
            </div>
            <Typography variant="body1">
              <strong>Userid:</strong> {vendor.userid}
            </Typography>
            <Typography variant="body1">
              <strong>Name:</strong> {vendor.name}
            </Typography>
            <Typography variant="body1">
              <strong>Shop Name:</strong> {vendor.shopName}
            </Typography>
            <Typography variant="body1">
              <strong>Contact:</strong> {vendor.contact}
            </Typography>
            <Typography variant="body1">
              <strong>Alternate Contact:</strong> {vendor.alternateContact}
            </Typography>
            <Typography variant="body1">
              <strong>Email:</strong> {vendor.email}
            </Typography>
            <Typography variant="body1">
              <strong>Number of Employees:</strong> {vendor.noOfEmployees}
            </Typography>
            <Typography variant="body1">
              <strong>Age:</strong> {vendor.age}
            </Typography>
            <Typography variant="body1">
              <strong>Aadhar Number:</strong> {vendor.adharNumber}
            </Typography>
            <Typography variant="body1">
              <strong>Pan Card:</strong> {vendor.panCard}
            </Typography>
            <Typography variant="body1">
              <strong>Location:</strong> {vendor.location}
            </Typography>
            <Typography variant="body1">
              <strong>Availability:</strong> {vendor.startTime} -{" "}
              {vendor.endTime}
            </Typography>
            <Typography variant="body1">
              <strong>Certificate:</strong>{" "}
              <a
                href={vendor.certificate}
                onClick={(e) => {
                  e.preventDefault();
                  openCertificate(vendor.certificate);
                }}
                style={{
                  textDecoration: "none",
                  color: "#007bff",
                  marginBottom: "20px",
                }}
              >
                View Certificate
              </a>
            </Typography>
          </>
        )}
        <Button
          onClick={onClose}
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            borderRadius: "5px",
            padding: "8px 16px",
            marginTop: "auto", // Pushes the button to the bottom
            alignSelf: "flex-start",
            marginLeft:"80%" // Aligns button to the left
          }}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default VendorDetailsModal;
