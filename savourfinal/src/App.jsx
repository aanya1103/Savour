import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import User from './IntegratedPages/userpage';
import LoginPage from './IntegratedPages/LoginPage'
import LoginPageVendor from './IntegratedPages/LoginPageVendor'
import RegistrationPage from './IntegratedPages/Registration';
import Fpage from './IntegratedPages/firstpage';
import VendorRgistration from './IntegratedPages/Vendoregistration';
import OrderCart from './screens/OrderCart';
import ResetPass from './IntegratedPages/resetPasss';
import NewPass from './IntegratedPages/newPass';
import Admin from './Admin/AdminPage'

// import Feed from './screens/home';
// import Sidebar from './screens/navbar';

function App() {
  return (
    <Router>
      <Routes>
            <Route path="/" element={<Fpage />} />   
            <Route path="/user/*" element={<User />} />
            <Route path="/admin/*" element={<Admin />} />
            <Route path="/registration" element={<RegistrationPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/loginVendor" element={<LoginPageVendor />} />
            <Route path="/vendor-registration" element={<VendorRgistration />} />
            <Route path="/ordercart/:orderId" element={<OrderCart/>}/>
            <Route path="/reset-password" element={<ResetPass/>}/>
            <Route path="/new-password" element={<NewPass/>}/>
      </Routes>
    </Router>
  );
}

export default App;

  // return (
  //   <Router>
  //     <div style={{ display: 'flex', height: '100vh' }}>
  //       <div className="col-2" style={{ flex: '0 0 200px', height: '100%', overflowY: 'auto', backgroundColor: '#f1f1f1' }}>
  //         <Sidebar />
  //       </div>
  //       <div className="col-10" style={{ flex: '1', height: '100%', overflowY: 'auto' }}>
  //         <Routes>
  //           <Route path="/home" element={<Feed />} />
  //         </Routes>
  //       </div>
  //     </div>
  //   </Router>
  // );

