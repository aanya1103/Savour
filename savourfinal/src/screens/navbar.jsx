// navbar.jsx

import React from 'react';
import './navbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch, faShoppingCart, faUser, faPlus } from '@fortawesome/free-solid-svg-icons';

function Sidebar() {
  return (
    <div className='row'>
      <div className=" col-2 sidebar bg-bluish-gray">
        <div className="text-center logo py-4 me-5 mb-4">
          <h3 className='text-warning'>SAVOUR</h3>
        </div>
        <ul className="nav nav-pills flex-column mb-3">
          <li className="nav-item p-2">
            <a className="nav-link " href="/user/home">
              <FontAwesomeIcon icon={faHome} style={{ paddingRight: '5px', color: '#fff' }} /> Home
            </a>
          </li>
          <li className="nav-item p-2">
            <a className="nav-link" href="/user/search">
              <FontAwesomeIcon icon={faSearch} style={{ paddingRight: '5px', color: '#fff' }} /> Search
            </a>
          </li>
          <li className="nav-item p-2">
            <a className="nav-link" href="/user/createpost">
              <FontAwesomeIcon icon={faPlus} style={{ paddingRight: '5px', color: '#fff' }} /> Create
            </a>
          </li>
          <li className="nav-item p-2">
            <a className="nav-link" href="/user/profile">
              <FontAwesomeIcon icon={faUser} style={{ paddingRight: '5px', color: '#fff' }} /> Profile
            </a>
          </li>
          <li className="nav-item p-2">
            <a className="nav-link" href="/" onClick={()=>{
              localStorage.clear()
            }}>
              <FontAwesomeIcon icon={faUser} style={{ paddingRight: '5px', color: '#fff' }} /> Log Out
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
