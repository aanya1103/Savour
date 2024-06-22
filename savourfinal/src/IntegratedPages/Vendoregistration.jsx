import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './VendorRegistration.css' // Import your CSS file

const VendorRegistration = () => {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [shopname, setShopName] = useState("");
    const [contact, setContact] = useState("");
    const [alternatecontact, setAlternateContact] = useState("");
    const [email, setEmail] = useState("");
    const [noe, setNoe] = useState("");
    const [age, setAge] = useState("");
    const [adhar, setAdhar] = useState("");
    const [pan, setPan] = useState("");
    const [loc, setLoc] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [photo, setphoto] = useState("");
    const [userid, setUserId] = useState("");
    const [pass, setPass] = useState("");
    const [bankName, setbankName] = useState("");
    const [accountNumber, setaccountNumber] = useState("");
    const [ifscCode, setifscCode] = useState("");
    const [certificate, setcertificate] = useState("");
    const [url1, setUrl1]= useState("");
    const [url2, setUrl2]= useState("");

    useEffect(()=>{
        if(url2){
        // const { id, email } = JSON.parse(localStorage.getItem("user"));
         fetch("http://localhost:5000/api/auth/vendorRequest",{
             method:"post",
             headers:{
                 "Content-Type":"application/json",
                //  "Authorization":"Bearer "+localStorage.getItem("jwt")
             },
             body:JSON.stringify({
                name, shopname,contact, alternatecontact, email, noe, age, adhar, pan, loc, startTime, endTime, url1, url2, userid, pass, bankName,accountNumber,ifscCode,
             })
         }).then(res=>res.json())
         .then(data=>{
     
            if(data.error){
              alert(data.errors)
               M.toast({html: data.error,classes:"#c62828 red darken-3"})
            }
            else{
                alert("Your request has been submitted!")
                navigate('/')
            }
         }).catch(err=>{
             console.log(err)
         })
     }
     },[url2])

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        setphoto(file);
        // if (file) {
        //     const reader = new FileReader();
        //     reader.onload = () => {
        //         setMediaPreview(reader.result);
        //     };
        //     reader.readAsDataURL(file);
        // }
    };

    const handleCertificateChange = (e) => {
        const file = e.target.files[0];
        setcertificate(file);
        // if (file) {
        //     const reader = new FileReader();
        //     reader.onload = () => {
        //         setMediaPreview(reader.result);
        //     };
        //     reader.readAsDataURL(file);
        // }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your form submission logic here
    };

    const postDetails= () =>{
        const data= new FormData()
        data.append("file", certificate)
        data.append("upload_preset","savour")
        data.append("cloud_name", "drze1lkbu")
        fetch("https://api.cloudinary.com/v1_1/drze1lkbu/image/upload", {
        method:"post",
        body: data
      })
      .then(res=>res.json())
      .then(data=>{
        setUrl1(data.url)
      }).catch(error=>
      {
        console.log(error)
      })
      const data1= new FormData()
        data1.append("file", photo)
        data1.append("upload_preset","savour")
        data1.append("cloud_name", "drze1lkbu")
        fetch("https://api.cloudinary.com/v1_1/drze1lkbu/image/upload", {
        method:"post",
        body: data1
      })
      .then(res=>res.json())
      .then(data1=>{
        setUrl2(data1.url)
      }).catch(error=>
      {
        console.log(error)
      })
      }

    return (
        // <div style={{width:'100%', height:'100%', backgroundColor:"red", alignContent:'center', display:'flex'}}>
        // <div className="container m-5" style={{ backgroundColor: '#2C2A28', color: 'white', padding: '20px', borderRadius: '10px', width:'50%', margin:'auto', justifyContent:'center', alignItems:'center'}}>
        <div className="registration-container1">
        <div className="form-container1">    
            <h2 className='coloryellow' style={{ textAlign: 'center' }}>Get Yourself Register</h2>
            <p style={{ textAlign: 'center', marginBottom: '20px' }}>All details must be filled properly by the Vendor for quick request acceptance</p>
            <div className="row">
                <form className="col s12" onSubmit={handleSubmit}>
                    <div className="row input-group">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input id="name" type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required/>
                    </div>
                    <div className="row input-group">
                        <label htmlFor="shop_name" className="form-label">Shop Name</label>
                        <input id="shop_name" type="text" className="form-control" value={shopname} onChange={(e) => setShopName(e.target.value)} />
                    </div>
                    <div className="row input-group">
                        <label htmlFor="contact" className="form-label">Contact</label>
                        <input id="contact" required type="text" className="form-control" maxLength={10} minLength={10} value={contact} onChange={(e) => setContact(e.target.value)} />
                    </div>
                    <div className="row input-group">
                        <label htmlFor="alternateContact" className="form-label">Alternate Contact</label>
                        <input id="alternateContact" required type="text" className="form-control" maxLength={10} minLength={10} value={alternatecontact} onChange={(e) => setAlternateContact(e.target.value)} />
                    </div>
                    <div className="row input-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input id="email" type="email" required className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="row input-group">
                        <label htmlFor="noofemp" className="form-label">Number of Employees</label>
                        <input id="noofemp" type="text" required className="form-control" value={noe} onChange={(e) => setNoe(e.target.value)} />
                    </div>
                    <div className="row input-group">
                        <label htmlFor="age" className="form-label">Age</label>
                        <input id="age" type="text" required className="form-control" value={age} onChange={(e) => setAge(e.target.value)} />
                    </div>
                    <div className="row input-group">
                        <label htmlFor="adharno" className="form-label">Adhar Number</label>
                        <input id="adharno" type="text" required className="form-control" value={adhar} onChange={(e) => setAdhar(e.target.value)} />
                    </div>
                    <div className="row input-group">
                        <label htmlFor="panno" className="form-label">Pan Card</label>
                        <input id="panno" type="text" required className="form-control" value={pan} onChange={(e) => setPan(e.target.value)} />
                    </div>
                    <div className="row input-group">
                        <label htmlFor="location" className="form-label">Usual Location</label>
                        <input id="location" type="text" required className="form-control" value={loc} onChange={(e) => setLoc(e.target.value)} />
                    </div>
                    <div className="row input-group">
                        <label htmlFor="durationstart" className="form-label">Usual Start Time (hh:mm)</label>
                        <input type="time" id="durationstart" required name="durationstart" value={startTime} onChange={(e) => setStartTime(e.target.value)}/>
                    </div>
                    <div className="row input-group">
                        <label htmlFor="durationend" className="form-label">Usual End Time (hh:mm)</label>
                        <input type="time" id="durationend" required name="durationend" value={endTime} onChange={(e) => setEndTime(e.target.value)}/>
                    </div>
                    <div className="row input-group">
                        <label htmlFor="photo" className="form-label">Upload Photograph</label>
                        <input type="file" id="photo" required className="form-control" onChange={handlePhotoChange} />
                    </div>
                    <div className="row input-group">
                        <label htmlFor="certificate" className="form-label">Upload Certificate</label>
                        <input type="file" id="certificate" required className="form-control" onChange={handleCertificateChange} />
                    </div>
                    <div className="row input-group">
                        <label htmlFor="userId" className="form-label">Set UserId</label>
                        <input id="userId" type="text" required className="form-control" value={userid} onChange={(e) => setUserId(e.target.value)} />
                    </div>
                    <div className="row input-group">
                        <label htmlFor="password" className="form-label">Set Password</label>
                        <input id="password" type="password" required className="form-control" value={pass} onChange={(e) => setPass(e.target.value)} />
                    </div>
                    <div className="row input-group">
                        <label htmlFor="bankName" className="form-label">Bank Name</label>
                        <input id="bankname" type="text" required className="form-control" value={bankName} onChange={(e) => setbankName(e.target.value)} />
                    </div>
                    <div className="row input-group">
                        <label htmlFor="accountNumber" className="form-label">Account Number</label>
                        <input id="accountnumber" type="text" required className="form-control" value={accountNumber} onChange={(e) => setaccountNumber(e.target.value)} />
                    </div>
                    <div className="row input-group">
                        <label htmlFor="ifscCode" className="form-label">IFSC Code</label>
                        <input id="ifscCode" type="text" required className="form-control" value={ifscCode} onChange={(e) => setifscCode(e.target.value)} />
                    </div>
                    <div className="row input-group" style={{ textAlign: 'center' }}>
                        <input className="btn btn-primary" required type="submit" value="Submit" onClick={()=>postDetails()}/>
                    </div>
                </form>
            </div>
        </div>
        </div>
    );
};

export default VendorRegistration;
