// UpdateForm.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Button, TextField, Paper } from "@mui/material";
import "./UpdateForm.css";

const UpdateForm = () => {
  const [data, setData] = useState({
    name: "",
    shopName: "",
    contact: 0,
    alternateContact:0,
    email: "", 
    numberOfEmployees: 0,
    age: 0,
    adharNumber: 0,
    panCard: "",
    location: "",
    startTime: "",
    endTime: "",
    photograph: "",
    certificate: "",
    userid: "",

  });
  const params = useParams();

  const getSingleUserData = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/admin/vrequest/confirm/${params.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response)
      const cfdata = await response.json();
      setData(cfdata);
      console.log(cfdata);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSingleUserData();
  }, [params.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/admin/vrequest/confirm/${params.id}/update`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (response.ok) {
        alert("Updated Successfully");
      } else {
        alert("Update Unsuccessful");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Paper className="update-form-container" elevation={3}>
      <h2>Update Vendor</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label=""
          name="_id"
          value={data._id}
          disabled // Set the disabled attribute to true
          fullWidth
          variant="outlined"
          margin="normal"
        />

        <TextField
          label="Name"
          name="name"
          value={data.name}
          onChange={handleInputChange}
          fullWidth
          variant="outlined"
          margin="normal"
        />

        <TextField
          label="Shop Name"
          name="shopName"
          value={data.shopName}
          onChange={handleInputChange}
          fullWidth
          variant="outlined"
          margin="normal"
        />

        <TextField
          label="Contact"
          name="contact"
          value={data.contact}
          onChange={handleInputChange}
          fullWidth
          variant="outlined"
          margin="normal"
        />

        <TextField
          label="Alternate Contact"
          name="alternateContact"
          value={data.alternateContact}
          onChange={handleInputChange}
          fullWidth
          variant="outlined"
          margin="normal"
        />

        <TextField
          label="Email"
          name="email"
          value={data.email}
          onChange={handleInputChange}
          fullWidth
          variant="outlined"
          margin="normal"
        />

        <TextField
          label="Number of Employees"
          name="numberOfEmployees"
          value={data.numberOfEmployees}
          onChange={handleInputChange}
          fullWidth
          variant="outlined"
          margin="normal"
        />

        <TextField
          label="Age"
          name="age"
          value={data.age}
          onChange={handleInputChange}
          fullWidth
          variant="outlined"
          margin="normal"
        />

        <TextField
          label="Adhar Number"
          name="adharNumber"
          value={data.adharNumber}
          onChange={handleInputChange}
          fullWidth
          variant="outlined"
          margin="normal"
        />

        <TextField
          label="Pan Card"
          name="panCard"
          value={data.panCard}
          onChange={handleInputChange}
          fullWidth
          variant="outlined"
          margin="normal"
        />

        <TextField
          label="Photograph"
          name="photograph"
          value={data.photograph}
          onChange={handleInputChange}
          fullWidth
          variant="outlined"
          margin="normal"
        />

        <TextField
          label="Certificate"
          name="certificate"
          value={data.certificate}
          onChange={handleInputChange}
          fullWidth
          variant="outlined"
          margin="normal"
        />
        <TextField
          label="Location"
          name="location"
          value={data.location}
          onChange={handleInputChange}
          fullWidth
          variant="outlined"
          margin="normal"
        />
        <TextField
          label="Start Time"
          name="starttime"
          value={data.startTime}
          onChange={handleInputChange}
          fullWidth
          variant="outlined"
          margin="normal"
        />
        <TextField
          label="End Time"
          name="endtime"
          value={data.endTime}
          onChange={handleInputChange}
          fullWidth
          variant="outlined"
          margin="normal"
        />

        <div className="form-buttons">
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
          <Link to="/admin/vrequest/confirm" className="back-link">
            <Button variant="contained" color="secondary">
              Back
            </Button>
          </Link>
        </div>
      </form>
    </Paper>
  );
};

export default UpdateForm;
