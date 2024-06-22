//integrateadminoptions.js
import React from 'react';
import { AdminUsers } from './AdminUsers';
import { VendorRequest } from './AdminVendorReq';
import {DisplayConfirmedVendor} from './DisplayConfirmedVendors'

export const MainContent = ({ match }) => {
  return (
    <div className="main-content">
      {match.params.option === 'ALL USERS' && <AdminUsers/>}
      {match.params.option === 'VENDOR REQUESTS' && <VendorRequest/>}
      {match.params.option === 'CONFIRMED VENDORS' && <DisplayConfirmedVendor/>}
    </div>
  );
};

