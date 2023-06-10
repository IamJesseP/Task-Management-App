/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Card, Button, Alert, ListGroup, Badge, Modal } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import '../style.css';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import Navibar from './Navibar';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleOpenModal = (task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };
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
      console.log(tasks.status);
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
    <div className='d-flex flex-column margin-1rem'>
      <Navibar className="navbar" />
      <div className='d-flex align-items justify-content flex-column'>
      <h2 className="text-center mb-4">Task Manager</h2>
      <div className="card-columns">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} handleOpenModal={handleOpenModal} />
        ))}
        {isModalOpen && selectedTask && (
        <TaskDetailModal task={selectedTask} show={isModalOpen} onHide={handleCloseModal} />
      )}
        </div>
      </div>
    </div>
  );
}

function TaskCard({ task, handleOpenModal }) {
  return (
    <Card className="bg-light mb-3" onClick={() => handleOpenModal(task)}>
      <Card.Header>{task.title}</Card.Header>
      <Card.Body>
        <Card.Text>{task.description}</Card.Text>
      </Card.Body>
      <Card.Footer>
        <Badge bg={task.status ? 'success' : 'secondary'} className="ml-2">
          {task.status ? 'Open' : 'Closed'}
        </Badge>
      </Card.Footer>
    </Card>
  );
}

function TaskDetailModal({ task, show, onHide }) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      className='pt-20px'
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Company: {task.company}</Modal.Title>
      </Modal.Header>
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">{task.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className='test'>
        <h6>{task.description}</h6>
        <p>{/* Include additional details about the task here, if available */}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='success'>Edit</Button>
        <Button onClick={onHide} variant='secondary'>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}