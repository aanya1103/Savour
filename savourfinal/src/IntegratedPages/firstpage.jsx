import './firstpage.css';
import React from 'react';
import add from "../assets/add.png";
import advertise from "../assets/advertise.png";
import calendar from "../assets/calendar.png";
import events from "../assets/events.png";
import create from "../assets/create.jpg";
import fresh from "../assets/fresh.png";
import left from "../assets/left.png";
import listing from "../assets/listing.png";
import location from "../assets/location.png";
import onlineorder from "../assets/onlineorder.png";
import order from "../assets/order.jpg";
import tick from "../assets/tick.png";
import right from "../assets/right.png";
import register from "../assets/register.jpg";
import savour from "../assets/savour.png";


function Fpage() {

  const rightclick= function (){
    var container= document.getElementById('box');
    sideScroll(container,'right',50,290,10);
  };
  const leftclick=function (){
      var container=document.getElementById('box');
      sideScroll(container,'left',50,290,10);
  };
  function sideScroll(element, direction, speed, distance, step) {
    var scrollAmount = 0; // Define scrollAmount inside the function
    var slideTimer = setInterval(function () {
        if (direction == 'left') {
            element.scrollLeft -= step;
        } else {
            element.scrollLeft += step;
        }
        scrollAmount += step;
        if (scrollAmount >= distance) {
            window.clearInterval(slideTimer);
        }
    }, speed)
}

  return (
    <div className="root img-fluid back" style={{ backgroundRepeat: 'no-repeat', overflowX: 'hidden' }}>
      <div className="container mb-5">
        <div className="row">
          <nav className="navbar navbar-light">
            <div className="container-fluid">
              <img style={{ marginTop: '0px', paddingTop: '0px' }} width="130px" height="50px" src={savour} alt="Savour" className="d-inline-block align-text-top" />
            </div>
          </nav>
          <div className="row m-5 ml-3">
            <h2 className="text-light">Partner with Savour
              at 5% commission!
            </h2>
            <br />
            <div className="row">
              <div className="col-5">
                <a href="/registration"><button  type="button" className="btn btn-info" style={{ width: '100%' }}>Register your Restaurant</button></a>
              </div>
              <div className="col-5">
                <a href="/login"><button type="button" className="btn btn-info" style={{ width: '100%' }}>Login to view your Registered Restaurant</button></a>
              </div>
            </div>
            <br />
            <br />
            <p className="text-light">Need help? Please email us at savour.ha@gmail.com</p>
          </div>
          <div className="row justify-content-md-center">
            <div className="col-7 p-5 m-0 shadow-lg gradient" style={{ color: 'aliceblue', borderRadius: '25px' }}>
              <h2 className="text-center">Get started with online ordering</h2>
              <p className="text-white-50 text-center">Please keep the documents ready for a smooth signup</p>
              <br />
              <div className="row justify-content-md-center">
                <div className="col-6">
                  <img src={tick} alt="+" width="18px" height="23px" /> FSSAI license copy
                  <br />
                  <img src={tick} alt="+" width="18px" height="23px" /> Regular GSTIN (if applicable)
                  <br />
                  <img src={tick} alt="+" width="18px" height="23px" /> Your restaurant Menu
                  <br />
                </div>
                <div className="col-6">
                  <img src={tick} alt="+" width="18px" height="23px" /> PAN Card
                  <br />
                  <img src={tick} alt="+" width="18px" height="23px" /> Bank Account Details
                  <br />
                  <img src={tick} alt="+" width="18px" height="23px" /> Aadhar Card
                  <br />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row p-5 justify-content-md-center text-dark" style={{ backgroundColor: 'rgb(242, 242, 242)', overflowX: 'hidden' }}>
        <h2 className="text-center mt-5 mb-3 typein">Why partner with us?</h2>
        <br />
        <p className="text-center mb-3">We enable you to get 60% more revenue, 10x new customers and boost your brand visibility by providing insights to improve your business.</p>
        <br />
        <div className="col-3 shadow-lg p-3 m-2 mb-5 pe-1  grow" style={{ backgroundColor: 'rgba(242, 242, 242, 0.5)', borderRadius: '15px' }}>
          <img src={location} alt=""/>&nbsp; Add Live Location
        </div>
        <div className="col-3 shadow-lg p-3 m-2 mb-5 pe-1 grow" style={{ backgroundColor: 'rgba(242, 242, 242, 0.5)', borderRadius: '15px' }}>
          <img src={add} alt="" />&nbsp; Post Menu &amp; Deals
        </div>
        <div className="col-3 shadow-lg p-3 m-2 mb-5 pe-1 grow" style={{ backgroundColor: 'rgba(242, 242, 242, 0.5)', borderRadius: '15px' }}>
          <img src={calendar} alt="" />&nbsp; Schedule Orders
        </div>
      </div>
      <div className="row p-5  mb-5 justify-content-md-center text-dark back2" style={{ backgroundRepeat: 'no-repeat', backgroundColor: 'rgb(255, 255, 255)' }}>
        <h2 className="text-center mb-5 mt-5">How it works?</h2>
        <br />
        <div className="col-3 shadow-lg p-4 m-2 text-center grow" style={{ backgroundColor: 'rgb(255, 255, 255)', borderRadius: '15px' }}>
          <img src={register} alt="" className="mt-1 mb-3" />
          <br />
          <p className="mb-1" style={{ fontWeight: 'bold', color: 'rgb(67, 24, 10)' }}>Register Online</p>
          <p style={{ fontSize: '12px' }}>And deliver orders to millions of customers with ease</p>
        </div>
        <div className="col-3 shadow-lg p-4 m-2 text-center grow" style={{ backgroundColor: 'rgb(255, 255, 255)', borderRadius: '15px' }}>
          <img src={create} alt="" className="mt-1 mb-3" />
          <br />
          <p className="mb-1" style={{ fontWeight: 'bold', color: 'rgb(67, 24, 10)' }}>Create Your Page</p>
          <p style={{ fontSize: '12px' }}>Help users discover your place by creating a listing on Zomato</p>
        </div>
        <div className="col-3 shadow-lg p-4 m-2 text-center grow" style={{ backgroundColor: 'rgb(255, 255, 255)', borderRadius: '15px' }}>
          <img src={order} alt="" className="mt-1 mb-3" />
          <br />
          <p className="mb-1" style={{ fontWeight: 'bold', color: 'rgb(67, 24, 10)' }}>Receive Orders Online</p>
          <p style={{ fontSize: '12px' }}>Manage orders on our partner app, web dashboard or API partners</p>
        </div>
      </div>
      <div className="row p-5" style={{ backgroundColor: 'rgb(242, 242, 242)' }}>
        <div className="container p-2" style={{ position: 'relative', width: '820px', backgroundColor: 'rgb(242, 242, 242)', padding: '20px', borderRadius: '10px' }}>
          <h2 className="text-center mb-5 mt-5 ">Our Products</h2>
          <div className="item-div" id="box" style={{ overflowX: 'auto', display: 'flex' }}>
            <div className="item m-4 p-0 shadow grow ">
              <div className="container-fluid text-center pe-2 pb-1 pt-4" style={{ height: '50%' }}>
                <img src={listing} alt="" style={{ width: '80%', height: '90%' }} />
              </div>
              <div className="container-fluid p-3" style={{ height: '50%' }}>
                <h5>Listings</h5>
                <p style={{ display: 'inline', fontSize: 'smaller' }}>A free app that allows you to manage your Zomato listing directly from your smartphone</p>
              </div>
            </div>
            <div className="item m-4 p-0 shadow grow">
              <div className="container-fluid text-center pe-2 pb-1 pt-4" style={{ height: '50%' }}>
                <img src={onlineorder} alt="" style={{ width: '80%', height: '90%' }} />
              </div>
              <div className="container-fluid p-3" style={{ height: '50%' }}>
                <h5>Online Ordering</h5>
                <p style={{ display: 'inline', fontSize: 'smaller' }}>Start taking orders online from millions of users near you and deliver with Zomato...</p>
              </div>
            </div>
            <div className="item m-4 p-0 shadow grow">
              <div className="container-fluid text-center pe-2 pb-1 pt-4" style={{ height: '50%' }}>
                <img src={advertise} alt="" style={{ width: '80%', height: '90%' }} />
              </div>
              <div className="container-fluid p-3" style={{ height: '50%' }}>
                <h5>Advertise</h5>
                <p style={{ display: 'inline', fontSize: 'smaller' }}>For every marketing dollar spent, Zomato returns over 8x the investment...</p>
              </div>
            </div>
            <div className="item m-4 p-0 shadow grow">
              <div className="container-fluid text-center pe-2 pb-1 pt-4" style={{ height: '50%' }}>
                <img src={events} alt="" style={{ width: '80%', height: '90%' }} />
              </div>
              <div className="container-fluid p-3" style={{ height: '50%' }}>
                <h5>Events</h5>
                <p style={{ display: 'inline', fontSize: 'smaller' }}>Partner with us for India’s grandest food &amp; entertainment carnival - “Zomaland”...</p>
              </div>
            </div>
            <div className="item m-4 p-0 shadow grow">
              <div className="container-fluid text-center pe-2 pb-1 pt-4" style={{ height: '50%' }}>
                <img src={fresh} alt="" style={{ width: '80%', height: '90%' }} />
              </div>
              <div className="container-fluid p-3" style={{ height: '50%' }}>
                <h5>Hyperpure</h5>
                <p style={{ display: 'inline', fontSize: 'smaller' }}>Supplies fresh and high quality ingredients to restaurant for serving delicious meals...</p>
              </div>
            </div>
          </div>
            <img src={left} onClick={leftclick} className="left" id="left" style={{ top: '56%', left: '-25px' }} />
            <img src={right} onClick={rightclick} className="right" id="right" style={{ top: '56%', right: '-25px' }} />
        </div>
      </div>
    </div>
  );
  }

export default Fpage;

