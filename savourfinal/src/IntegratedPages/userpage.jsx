// UserPage

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Feed from '../screens/home';
import Sidebar from '../screens/navbar';
import SearchPage from '../screens/SearchPage';
import Profile from '../screens/profile';
import CreatePost from '../screens/createpost';
import UserProfile from '../screens/userprofile';
import OrderCart from '../screens/OrderCart';
import { useState, useEffect } from 'react';

function User() {

  return (

      <div style={{ display: 'flex', height: '100vh' }}>
        <div className="col-3" style={{ flex: '0 0 200px', height: '100%', overflowY: 'auto', backgroundColor: '#f1f1f1' }}>
          <Sidebar />
        </div>
        <div className="col-9 bgcolor" style={{ flex: '1', height: '100%', overflowY: 'auto' }}>
          <Routes>
            <Route path="/home" element={<Feed />}/>
            <Route path="/search" element={<SearchPage/>}/>
            <Route path="/createpost" element={<CreatePost/>}/>
            <Route exact path="/profile" element={<Profile/>}/>
            <Route path="/profile/:userid" element={<UserProfile/>}/>
            <Route path="/ordercart/:orderId" element={<OrderCart/>}/>
          </Routes>
        </div>
      </div>
  );
}

export default User;
