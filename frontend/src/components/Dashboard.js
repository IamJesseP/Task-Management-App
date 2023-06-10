/* eslint-disable prettier/prettier */
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
      const token = await currentUser.getIdToken(true);
      console.log(token)
      const response = await fetch('http://localhost:4000/dashboard/tasks', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
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
    <div className='d-flex flex-column'>
      <Navibar className="navbar" />
      
        <div className='d-flex align-items justify-content flex-column'>

      <h2 className="text-center mb-4">Task Manager</h2>
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
      </div>
    </div>
  );
}
