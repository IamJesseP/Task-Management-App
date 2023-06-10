import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav, Navbar, Container, NavDropdown, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../style.css';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAuth, updateProfile } from 'firebase/auth';
const auth = getAuth();
// switch hrefs with react router maybe?
function Navibar() {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { currentName, currentUser, logout } = useAuth();
  console.log(currentName);

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
      console.log(error);
    }
  }
  return (
    <Navbar bg="white" expand="md" className="w-100">
      <Container>
        <Navbar.Brand href="/" style={{ float: 'left' }}>
          Dashboard
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Marketplace</Nav.Link>
            <Nav.Link href="#link">My Tasks</Nav.Link>
            <NavDropdown title="Profile" id="basic-nav-dropdown">
              <NavDropdown.Item>{`${displayName}`}</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.1">Settings</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>Log out</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
export default Navibar;
