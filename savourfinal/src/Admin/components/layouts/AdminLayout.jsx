// AdminLayout.js
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import './AdminLayout.css';

const AdminLayout = () => {
  return (
    <div className="fixed-sidebar bg-gray" style={{background: 'linear-gradient(90deg, #000000, #1d100d)', height: '100%'}}>
      <div className="text-center logo pb-4 pt-2 me-5 mb-4">
        <h3 style={{ color: '#fff' }}>SAVOUR</h3>
      </div>
      <ul className="nav nav-pills flex-column mb-3">
        <li className="nav-item p-2">
          <a className="nav-link" href="/admin/users">
            <FontAwesomeIcon icon={faUser} style={{ paddingRight: '5px', color: '#fff' }} /> VIEW USERS
          </a>
        </li>
        <li className="nav-item p-2">
          <a className="nav-link" href="/admin/vrequest">
            <FontAwesomeIcon icon={faUser} style={{ paddingRight: '5px', color: '#fff' }} /> VENDOR REQUEST
          </a>
        </li>
        <li className="nav-item p-2">
          <a className="nav-link" href="/admin/vrequest/confirm">
            <FontAwesomeIcon icon={faUser} style={{ paddingRight: '5px', color: '#fff' }} /> CONFIRMED VENDORS
          </a>
        </li>
        <li className="nav-item p-2">
          <a className="nav-link" href="/admin/reports">
            <FontAwesomeIcon icon={faUser} style={{ paddingRight: '5px', color: '#fff' }} /> REPORTS
          </a>
        </li>
        <li className="nav-item p-2">
          <a className="nav-link" href="/admin/payment">
            <FontAwesomeIcon icon={faUser} style={{ paddingRight: '5px', color: '#fff' }} /> PAYMENTS
          </a>
        </li>
      </ul>
    </div>
  );
}

export default AdminLayout;
