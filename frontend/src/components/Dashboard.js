import React, { useEffect, useState } from 'react';
import { Card, Button, Alert, ListGroup } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import Navibar from './Navibar';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5000/dashboard/tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  //changes above
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

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
    <>
      <div className="container">
        <h2 className="text-center mb-4">Task Manager</h2>
        <Navibar className="navbar" />
        <Card>
          <Card.Body>
            <ListGroup variant="flush">
              {tasks.map((task) => (
                <ListGroup.Item key={task.id}>
                  <h5>{task.title}</h5>
                  <p>{task.description}</p>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      </div>

      {/* <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong>Email: </strong>
          {currentUser.email}
          <br />
          <strong>User: </strong>
          {currentUser.displayName}
          <Link to="/update-profile" className="btn btn-primary w-100">
            Update profile
          </Link>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={handleLogout}>
          Log out
        </Button>
      </div> 
      </Card> 
    */}
    </>
  );
}
