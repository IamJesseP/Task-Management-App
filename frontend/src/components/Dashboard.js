import React, { useEffect, useState } from 'react';
import { Card, Button, Alert, ListGroup } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import '../style.css';
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
      const response = await fetch('http://localhost:4000/dashboard/tasks');
      const data = await response.json();
      console.log(data);
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

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
      </div>
      <div className="card-columns">
        {tasks.map((task) => (
          <Card key={task.id} className="bg-light mb-3">
            <Card.Header>{task.title}</Card.Header>
            <Card.Body>
              <Card.Text>{task.description}</Card.Text>
            </Card.Body>
            <Card.Footer>
              <small className="text-muted">Task ID: {task.id}</small>
            </Card.Footer>
          </Card>
        ))}
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
    </Card> */}
    </>
  );
}
