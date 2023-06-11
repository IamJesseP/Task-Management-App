/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Card, Button, Alert, ListGroup, Badge, Modal, Form } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import '../style.css';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import Navibar from './Navibar';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { currentUser, logout, currentName } = useAuth();
  

  
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
  
  const handleOpenModal = (task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div className='d-flex flex-column margin-1rem'>
      <Navibar className="navbar" />
      <div className='d-flex align-items justify-content flex-column'>
      <h2 className="text-center mb-4">Task Manager</h2>
      <div className="card-columns">
      { tasks.map((task) => ( //if tasks is empty, screen throws error
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
      <Card.Header>{task.company}</Card.Header>
      <Card.Header>{task.title}</Card.Header>
      <Card.Body>
        <Card.Text>{task.description}</Card.Text>
      </Card.Body>
      <Card.Footer>
        <Badge bg={!task.status ? 'success' : 'secondary'} className="ml-2">
          {!task.status ? 'Open' : 'Closed'}
        </Badge>
      </Card.Footer>
    </Card>
  );
}

function TaskDetailModal({ task, show, onHide }) {
  const [isEditOn, setIsEditOn] = useState(false)
  const [check, setCheck] = useState(task.status ? true : false)
  const [userType, setUserType] = useState('')
  const { currentUser, logout, currentName } = useAuth();
  let displayName = currentName
  

  function handleStatus(){
    setCheck(!check)
    console.log(check)
  }

  function handleEdit(){
    setIsEditOn(!isEditOn)
    console.log(isEditOn)
  }

  function updateModalComponents(){
    if (displayName.startsWith('student')){
      setUserType('student')
     
    }
    if(displayName.startsWith('company')){
      setUserType('company')
      handleEdit()
    }
  }
  function handleClaim(){

  }

  const updateStudentTask = async (taskId, isSubmitted, submissionCounter) => {
    try {
      const token = await auth.currentUser.getIdToken(true); 
      const response = await fetch(`http://localhost:4000/dashboard/tasks/studentUpdate/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          isSubmitted, // task.isSubmitted
          submissionCounter, // return current task.submissionCounter
        }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      return data;
  
    } catch (error) {
      console.error('Error:', error);
    }
  };
  useEffect(()=>updateModalComponents(), [])

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      className='pt-20px'
      backdrop='static'
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
        
        
      </Modal.Body>
      <Modal.Footer>
    { task.student && <p>Being worked on by: {task.student }</p>}
      {/* <Form.Check 
        type="checkbox"
        id="custom-switch"
        label="Mark Complete"
        onChange={handleStatus}
        checked = {check}
      />  lets move to myTasks for student*/}
        {userType === 'student' && 
        <Button 
          variant='success' 
          onClick={()=>updateStudentTask(task.id, task.isSubmitted, task.submissionCounter)} 
          disabled={task.student}
        >
          {task.student ? 'Claimed': 'Claim Task'}
        </Button>}
        <Button onClick={onHide} variant={'secondary'}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}