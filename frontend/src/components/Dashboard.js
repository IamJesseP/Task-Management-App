/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Card, Button, Alert, ListGroup, Badge, Modal, Form, Container, Col, Row, Navbar, Nav } from 'react-bootstrap';
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
  const { currentUser, logout, currentName, userPhotoURL } = useAuth();
  let photoUrl = userPhotoURL;
 console.log(userPhotoURL);
  
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      await currentUser.reload()
      const token = await currentUser.getIdToken(true);
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
  const handleTaskUpdate = async (taskId, isSubmitted, submissionCounter) => {
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
  
      await fetchTasks();
      const updatedTask = await response.json()
      return updatedTask;
  
    } catch (error) {
      console.error('Error:', error);
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
    <div className="d-flex">
      <Navibar className="navbar" />
      <div className="content">
        <h2 className="text-center mb-4">Marketplace</h2>
        <div className="card-columns">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} handleOpenModal={handleOpenModal} profilePhoto={userPhotoURL} />
          ))}
          {isModalOpen && selectedTask && (
            <TaskDetailModal
              task={selectedTask}
              show={isModalOpen}
              onProfileUpdate={handleTaskUpdate}
              onHide={handleCloseModal}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function TaskCard({ task, handleOpenModal, profilePhoto }) {
  return (
    <Card className="mb-3 card2" style={{ borderRadius: "20px" }} onClick={() => handleOpenModal(task)}>
      <Card.Body>
        <Col>
          <span className="h6 font-semibold text-muted text-sm d-block mb-2">
            {task.displayPhoto && <img src={task.displayPhoto} width={'100px'}></img>}
          </span>
        </Col>
        <Col>
          <span className="h6 font-semibold text-muted text-sm d-block mb-2">
          {task.company}
          </span>
          <span className="h6 font-semibold mb-0">{task.title}</span>
        </Col>
        <Card.Text>{task.description}</Card.Text>
        <div className="mt-2 mb-0 text-sm">
          <Badge bg={!task.status ? 'success' : 'secondary'} className="ml-2 rounded-pill bg-opacity-30">
            {!task.status ? 'Open' : 'Closed'}
          </Badge>
        </div>
      </Card.Body>
      {/* <Card.Footer>
        <Badge bg={!task.status ? 'success' : 'secondary'} className="ml-2">
          {!task.status ? 'Open' : 'Closed'}
        </Badge>
      </Card.Footer> */}
    </Card>
  );
}

function TaskDetailModal({ task, show, onHide, onProfileUpdate }) {
  const [isEditOn, setIsEditOn] = useState(false)
  const [check, setCheck] = useState(task.status ? true : false)
  const [userType, setUserType] = useState('')
  const [taskClaimStatus, setTaskClaimStatus] = useState(task.student)
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

  const handleUpdateAndClose = async (taskId, isSubmitted, submissionCounter) => {
    await onProfileUpdate(taskId, isSubmitted, submissionCounter)
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
          onClick={()=>{
            handleUpdateAndClose(task.id, task.isSubmitted, task.submissionCounter)
            setTaskClaimStatus(!taskClaimStatus)
          }} 
          disabled={taskClaimStatus}
        >
          {taskClaimStatus ? 'Claimed': 'Claim Task'}
        </Button>}
        <Button onClick={onHide} variant={'secondary'}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}