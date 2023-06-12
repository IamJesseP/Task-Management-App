/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Card, Button, Alert, ListGroup, Badge, Modal, Form, Container, Col, Row, Navbar, Nav, ToggleButton } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import '../style.css';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import Navibar from './Navibar';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [checked, setChecked] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { currentUser, logout, currentName, userPhotoURL } = useAuth();
  
  
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

  useEffect(() => {
    fetchTasks();
}, [refreshTrigger]);

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
        <div className='header'>
          <div className="container-row" style={{ height: "100px"}}>
            <h2 className="text-center mb-0">Marketplace</h2>
            <ToggleButton
              className="mb-2"
              id="toggle-check"
              type="checkbox"
              variant="outline-primary"
              checked={checked}
              value="1"
              onChange={(e) => setChecked(e.currentTarget.checked)}
            >
            Completed
            </ToggleButton>
          </div>
        </div>
        <div className="card-columns">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} handleOpenModal={handleOpenModal} profilePhoto={userPhotoURL} />
          ))}
          {isModalOpen && selectedTask && (
            <TaskDetailModal
              task={selectedTask}
              show={isModalOpen}
              onHide={handleCloseModal}
              setRefreshTrigger={setRefreshTrigger}
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
        <Card.Img variant="top" src={task.displayPhoto}  style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px', height: '100px' }}/>
        <Card.Body>
        <Col>
          <span className="h6 font-semibold text-muted text-sm d-block mb-2">
          {task.company}
          </span>
          <span className="h6 font-semibold mb-0">{task.title}</span>
        </Col>
        <Card.Text>{task.description}</Card.Text>
      </Card.Body>
        <Card.Footer>

        <div className="mt-2 mb-0 text-sm">
          <Badge bg={task.student ? 'secondary' : 'success'} className="ml-2 rounded-pill bg-opacity-30">
            {task.student ? 'Claimed' : 'Open'}
          </Badge>
        </div>
        </Card.Footer>
      {/* <Card.Footer>
        <Badge bg={!task.status ? 'success' : 'secondary'} className="ml-2">
          {!task.status ? 'Open' : 'Closed'}
        </Badge>
      </Card.Footer> */}
    </Card>
  );
}

function TaskDetailModal({ task, show, onHide, setRefreshTrigger }) {
  const [isEditOn, setIsEditOn] = useState(false)
  const [check, setCheck] = useState(task.status ? true : false)
  const [userType, setUserType] = useState('')
  const [taskClaimStatus, setTaskClaimStatus] = useState(task.student)
  const { currentUser, logout, currentName } = useAuth();
  let displayName = currentName

  const handleTaskUpdate = async (taskId, submissionStatus) => {
    try {
      const token = await auth.currentUser.getIdToken(true); 
      const response = await fetch(`http://localhost:4000/dashboard/tasks/studentUpdate/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          submissionStatus: submissionStatus // task.submissionStatus
        }),
      });
      
      if (!response.ok) {
        console.error(`Response status: ${response.status}`);
        throw new Error('Network response was not ok');
      }
  
      // await fetchTasks();
      const updatedTask = await response.json()
      return updatedTask;
  
    } catch (error) {
      console.error('Error:', error);
    }
  };

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


  const handleUpdateAndClose = async (taskId, submissionStatus) => {
    await handleTaskUpdate(taskId, submissionStatus)
    setRefreshTrigger(prev => !prev)
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
      <Modal.Body>
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
            handleUpdateAndClose(task.id, task.submissionStatus)
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