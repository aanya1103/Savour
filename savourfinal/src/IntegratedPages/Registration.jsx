import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Registration.css'; // Import your CSS file for styling

const RegistrationPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userid: '',
    email: '',
    contact: '',
    password: '',
    confirmPassword: ''
  });
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordsMatch(false);
      return;
    }
    setPasswordsMatch(true);
    console.log("here");
    fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      if (response) {
        // Registration successful
        console.log('Registration successful');
        alert("Thank You for Registration!");
        // Reset form after successful registration
        setFormData({
          userid: '',
          email: '',
          contact: '',
          password: '',
          confirmPassword: ''
        });
        navigate('/login')
      } else {
        // Registration failed
        alert('Make sure you have filled all the fields correctly!');
      }
    })
    .catch(error => {
      console.log('Error:', error);
    });
  };

  return (
    <div className="registration-container">
      <div className="form-container">
        <h4 className='coloryellow'>Lets Get you Registered</h4>
        <br />
        {!passwordsMatch && <p>Passwords do not match!</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>User ID:</label>
            <input
              type="text"
              name="userid"
              value={formData.userid}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Contact:</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button className='loginButton' type="submit">Register</button>
          <a href="/vendor-registration">Register Yourself as a Vendor</a> 
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
