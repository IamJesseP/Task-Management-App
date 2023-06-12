/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Card, Button, Badge, Modal, Col, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import '../style.css';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import Navibar from './Navibar';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [checked, setChecked] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [filterTasks, setFilterTasks] = useState('all');
  const [filterVariant, setFilterVariant] = useState('primary');
  const navigate = useNavigate();
  const { currentUser, logout, currentName, userPhotoURL } = useAuth();

  const fetchTasks = async () => {
    try {
      await currentUser.reload();
      const token = await currentUser.getIdToken(true);
      const response = await fetch(
        'https://tech-incubator-task-api.herokuapp.com/dashboard/tasks',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
      const data = await response.json();
      await currentUser.reload();
      navigate('/');
      setTasks(data);
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

  const [toggle, setToggle] = useState(true);
  const Toggle = () => {
    setToggle(!toggle);
  };

  return (
    <div className="d-flex">
      {toggle && (
        <div className="nav">
          <Navibar className="navbar" />
        </div>
      )}
      <div className="content">
        <ToggleButton
          variant="primary"
          style={{
            maxWidth: '250px',
            position: 'relative',
            left: '20px',
            top: '20px',
            zIndex: '100'
          }}
          onClick={Toggle}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-list"
            viewBox="0 0 16 16">
            <path
              fillRule="evenodd"
              d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
            />
          </svg>
        </ToggleButton>
        <div className="container-row" style={{ height: '100px' }}>
          <h2 className="text-center">Marketplace</h2>
          <div className="filterButton">
            <ToggleButtonGroup
              className="mb-3 d-flex justify-content-center"
              type="radio"
              name="filterTasks"
              value={filterTasks}
              onChange={(value) => setFilterTasks(value)}>
              <ToggleButton
                variant={filterVariant === 'all' ? 'primary' : 'outline-primary'}
                value="all"
                onClick={() => setFilterTasks('all')}>
                All
              </ToggleButton>
              <ToggleButton
                variant={filterVariant === 'open' ? 'primary' : 'outline-primary'}
                value="open"
                onClick={() => setFilterTasks('open')}>
                Open
              </ToggleButton>
              <ToggleButton
                variant={filterVariant === 'claimed' ? 'primary' : 'outline-primary'}
                value="claimed"
                onClick={() => setFilterTasks('claimed')}>
                Claimed
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
        </div>
        <div className="card-columns">
          {filterTasks === 'all' &&
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                handleOpenModal={handleOpenModal}
                profilePhoto={userPhotoURL}
              />
            ))}
          {filterTasks === 'open' &&
            tasks.map(
              (task) =>
                !task.student && (
                  <TaskCard
                    key={task.id}
                    task={task}
                    handleOpenModal={handleOpenModal}
                    profilePhoto={userPhotoURL}
                  />
                )
            )}
          {filterTasks === 'claimed' &&
            tasks.map(
              (task) =>
                task.student && (
                  <TaskCard
                    key={task.id}
                    task={task}
                    handleOpenModal={handleOpenModal}
                    profilePhoto={userPhotoURL}
                  />
                )
            )}
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
    <Card
      className="mb-3 card2"
      style={{ borderRadius: '20px' }}
      onClick={() => handleOpenModal(task)}>
      <Card.Img
        variant="top"
        src={task.displayPhoto}
        style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px', height: '100px' }}
      />
      <Card.Body>
        <Col>
          <span className="h6 font-semibold text-muted text-sm d-block mb-2">{task.company}</span>
          <span className="h6 font-semibold mb-0">{task.title}</span>
        </Col>
        <Card.Text>{task.description}</Card.Text>
      </Card.Body>
      <Card.Footer>
        <div className="mt-2 mb-0 text-sm">
          <Badge
            bg={task.student ? 'secondary' : 'success'}
            className="ml-2 rounded-pill bg-opacity-30">
            {task.student ? 'Claimed' : 'Open'}
          </Badge>
        </div>
      </Card.Footer>
    </Card>
  );
}

function TaskDetailModal({ task, show, onHide, setRefreshTrigger }) {
  const [isEditOn, setIsEditOn] = useState(false);
  const [check, setCheck] = useState(task.status ? true : false);
  const [userType, setUserType] = useState('');
  const [taskClaimStatus, setTaskClaimStatus] = useState(task.student);
  const { currentUser, logout, currentName } = useAuth();
  let displayName = currentName;

  const handleTaskUpdate = async (taskId, submissionStatus) => {
    try {
      const token = await auth.currentUser.getIdToken(true);
      const response = await fetch(
        `https://tech-incubator-task-api.herokuapp.com/dashboard/tasks/studentUpdate/${taskId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            submissionStatus: submissionStatus // task.submissionStatus
          })
        }
      );

      if (!response.ok) {
        console.error(`Response status: ${response.status}`);
        throw new Error('Network response was not ok');
      }

      // await fetchTasks();
      const updatedTask = await response.json();
      return updatedTask;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  function handleEdit() {
    setIsEditOn(!isEditOn);
  }

  function updateModalComponents() {
    if (displayName.startsWith('student')) {
      setUserType('student');
    }
    if (displayName.startsWith('company')) {
      setUserType('company');
      handleEdit();
    }
  }

  const handleUpdateAndClose = async (taskId, submissionStatus) => {
    await handleTaskUpdate(taskId, submissionStatus);
    setRefreshTrigger((prev) => !prev);
  };
  useEffect(() => updateModalComponents(), []);

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      className="pt-20px"
      style={{ borderRadius: '20px' }}
      backdrop="static"
      centered>
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
        {task.student && <p>Being worked on by: {task.student}</p>}
        {!task.student && userType === 'company' && <p>Unclaimed {task.student}</p>}
        {userType === 'student' && (
          <Button
            variant="success"
            onClick={() => {
              handleUpdateAndClose(task.id, task.submissionStatus);
              setTaskClaimStatus(!taskClaimStatus);
            }}
            disabled={taskClaimStatus}>
            {taskClaimStatus ? 'Claimed' : 'Claim Task'}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}
