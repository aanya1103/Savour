// App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "./components/layouts/AdminLayout";
import AdminUsers from "./components/AdminUsers";
import VendorRequest from "./components/AdminVendorReq";
import DisplayConfirmedVendors from "./components/DisplayConfirmedVendors";
import UpdateForm from "./components/UpdateForm";
import Reports from "./components/Reports";
import ViewVendors from "./components/ViewVendors";  
import AllVendorReport from "./components/AllVendorReport";
import  Payments from "./components/Payments"
function Admin() {
  return (
      <div className="App row">
        <div className="col-3">
          <AdminLayout />
        </div>
        <div className="col-9 scrollable-content" style={{ overflowY: "auto" }}>
          <Routes>
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/vrequest" element={<VendorRequest />} />
            <Route path="/payment" element={<Payments />} />
            <Route
              path="/vrequest/confirm"
              element={<DisplayConfirmedVendors />}
            />
            <Route path="/vrequest/confirm/:id" element={<UpdateForm />} />
          </Routes>
          <Routes>
            <Route path="/reports" element={<Reports />}></Route>
            <Route path="/reports/vendor" element={<ViewVendors />}></Route>
            <Route path="/reports/vendor/Allvendor"  element={<AllVendorReport /> }/> 
          </Routes>
        </div>
      </div>
  );
}

export default Admin;
