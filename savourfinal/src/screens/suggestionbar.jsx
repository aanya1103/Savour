
import React from 'react';
import Img from "../assets/storypic.png";
import './suggest.css'; // Import the CSS file

function Suggest() {
  return (
    <div className="d-flex flex-column shadow-lg bg-color-suggestion align-items-start p-2 m-0" style={{ height: "100vh", position: 'fixed', width:'100% '}}>
      <h5 className='text-warning mx-2 my-3'>Suggestions</h5>
      <div className="suggestion-box">
        <img
          src={Img}
          className="rounded-circle my-4 img-fluid"
          alt="Suggestions"
          style={{ width: '60px', height: '60px', marginRight:"22px" }}
        />
        <div className='d-flex flex-column pt-1 '>
          <h6 className="pt-2" style={{ color: 'white' }}>Harsha</h6>
          <p  style={{ color: 'white', fontSize: '12px' }}>Student NPGC</p>
        </div>
        <button type="button" className="btn btn-warning btn-sm p-2 my-4 justify-content-end">Add</button>
      </div>
    </div>
  );
}

export default Suggest;
