import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./newPass.css" // Import CSS for styling

const NewPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
     // Get the reset token from the URL parameter

     console.log("token from Frontend "+token)
  
    if (newPassword.trim() === '' || confirmPassword.trim() === '') {
      setErrorMessage('Please fill in all fields.');
      return;
    } else if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    } else if (!token) {
      setErrorMessage('Reset token not found.');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/api/auth/reset-password?token=${token}`, { // Include the token in the URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Assuming you have a token stored in localStorage or state
          },
        body: JSON.stringify({ newPassword, confirmPassword })
      });
  
      if (!response.ok) {
        const data = await response.json();
        setErrorMessage(data.message); // Assuming the backend sends error messages in a 'message' field
      } else {
        setSuccessMessage('Password reset successfully.'); // Assuming the backend sends a success message upon successful password reset
      }
    } catch (error) {
      console.error('Error occurred:', error);
      setErrorMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="container">
      <h2 className="reset-password-text">Reset Password</h2>
      <p className="reset-instruction-text">Reset your new password</p>
      <form onSubmit={handleFormSubmit}>
        <div className="form-group">
          <input
            type="password"
            className="form-control"
            placeholder="New Password"
            value={newPassword}
            onChange={handleNewPasswordChange}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            className="form-control"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
        </div>
        <button type="submit" className="btn btn-primary submit-btn">Submit</button>
        {errorMessage && <p className="text-danger">{errorMessage}</p>}
      </form>
      <p className="sign-in-link">Already have an account? <Link to="/">&lt; Sign in</Link></p>
    </div>
  );
};

export default NewPassword;