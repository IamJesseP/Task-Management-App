import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../style.css';
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
const auth = getAuth();
function Navibar() {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { currentName, logout } = useAuth();

  let displayName = currentName;
  if (currentName.startsWith('student') || currentName.startsWith('company')) {
    displayName = currentName.slice(8);
  }
  async function handleLogout() {
    setError('');
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      setError('Failed to log out');
    }
  }

  return (
    <>
      <Navbar className="navbar">
        <div className="header1">
          <div className="container-row2">
            <h2 className="text-center mb-0">
              <Link to="/" style={{ textDecoration: 'none' }}>
                <span className="logo">Tech Incubator</span>
              </Link>
            </h2>
          </div>
          <ul className="navbar-nav flex-column my-1">
            <li className="nav-item">
              <Nav.Link className="nav-link" href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-house icon"
                  viewBox="0 0 16 16">
                  <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z" />
                </svg>
                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                  Marketplace
                </Link>
              </Nav.Link>
            </li>
            <li className="nav-item">
              <Nav.Link className="nav-link" href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="16"
                  fill="currentColor"
                  className="bi bi-card-checklist icon"
                  viewBox="0 0 16 16">
                  <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z" />
                  <path d="M7 5.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0zM7 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0z" />
                </svg>
                <i className="bi bi-b-chart"></i>{' '}
                <Link to="/my-tasks" style={{ textDecoration: 'none' }}>
                  My Tasks
                </Link>
              </Nav.Link>
            </li>
            <li className="nav-item">
              <Nav.Link className="nav-link" href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-chat icon"
                  viewBox="0 0 16 16">
                  <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z" />
                </svg>
                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                  Messages
                </Link>
              </Nav.Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-people-fill icon"
                  viewBox="0 0 16 16">
                  <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                </svg>
                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                  Users
                </Link>
              </a>
            </li>
            <hr className="bar"></hr>
            <li className="nav-item mt-auto">
              <NavDropdown title="Profile" id="basic-nav-dropdown" style={{ color: '#0d6dfd' }}>
                <NavDropdown.Item>{displayName}</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.1">Settings</NavDropdown.Item>
              </NavDropdown>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#" onClick={handleLogout} style={{ color: '#0d6dfd' }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-box-arrow-left icon"
                  viewBox="0 0 16 16">
                  <path
                    fillRule="evenodd"
                    d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2ZM1 8a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1h-10A.5.5 0 0 1 1 8ZM8 12a.5.5 0 0 0-.5.5v1.5a.5.5 0 0 0 1 0V12.5A.5.5 0 0 0 8 12Z"
                  />
                </svg>{' '}
                Logout
              </a>
            </li>
          </ul>
        </div>
      </Navbar>
    </>
  );
}
export default Navibar;
