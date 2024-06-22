import React, { useState } from 'react';
import { Link  } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import  "./resetPasss.css"

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };
  const navigate = useNavigate();


  // const handleFormSubmit = (e) => {
  //   e.preventDefault();
  //   if (email.trim() === '') {
  //     setErrorMessage('Please enter your email');
  //   } else {
  //     // Send request to reset password
  //     // You can implement the logic to send the reset link here


  //     console.log(Reset link sent to ${email});
  //     navigate('/new-pass');
  //   }
  // };


  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (email.trim() === '') {
      setErrorMessage('Please enter your email');
    } else {
      try {
        const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
        console.log(data)
        if (response.ok) {
          setSuccessMessage(data.message);
          console.log(`Reset link sent to ${email}`);
          // navigate('/new-pass');
        } else {
          setErrorMessage(data.message);
          throw new Error('Failed to send reset link');
          
        }
      } catch (error) {
        console.error('Error:', error);
        setErrorMessage('Failed to send reset link. Please try again later.');
      }
    }
  };


  // const handleButtonClick = () => {
  //   // Redirect to the reset password page
  //   navigate('/reset-pass');
  // };

  return (
    <>
    
    {/* console.log("in reset password") */}
    <div className="container mt-5" style={{alignContent:"center", justifyContent:"center", textAlign:"center", display:"flex",}}>
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card" style={{width:"500px"}}>
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Forgot your Password?</h2>
              <p className="card-text text-center">Enter your email and we will send you a link to reset your password.</p>
              <form onSubmit={handleFormSubmit}>
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your Gmail"
                    value={email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary" >Send Request</button>
                </div>
                {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>}
              </form>
              <p className="text-center mt-3">Remember your password? <Link  to="/login">Sign in</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>

    </>
  );
};

export default ForgotPassword;