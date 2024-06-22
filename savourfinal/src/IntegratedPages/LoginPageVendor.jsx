import React, { useState, useContext } from 'react';
import './LoginPageVendor.css';
import { useNavigate } from 'react-router-dom';
import M from 'materialize-css'

const LoginFormVendor = () => {
  // const {state,dispatch} = useContext(UserContext)
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    

    e.preventDefault();
  
    fetch('http://localhost:5000/api/auth/login-vendor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(res=>res.json())
        .then(data=>{
            console.log(data)
           if(data.error){
              alert(data.error)
           }
           else{
               localStorage.setItem("jwt",data.token)
               localStorage.setItem("user",JSON.stringify(data.user))
               console.log(JSON.stringify(data.user))
              //  dispatch({type:"USER",payload:data.user})
               alert("LogIn Successful")
               navigate('/user');
           }
        }).catch(err=>{
            console.log(err)
        })
  };

  return (
    <div className="glass-container">
      <div className="form-container2">
        <h4 className="coloryellow">Vendor LogIn</h4>
        <br />
        <form onSubmit={handleSubmit}>
        <div id="error-message">{errorMessage}</div>
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
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div id="error-message">{errorMessage}</div>

          <div className="button-container"> 
            <button className="loginButton" type="submit">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginFormVendor;
