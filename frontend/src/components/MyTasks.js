/* eslint-disable react/prop-types */

import React, { useEffect, useState } from 'react';
import {
  Card,
  Button,
  Badge,
  Modal,
  Col,
  Form,
  ModalFooter,
  ToggleButton,
  ToggleButtonGroup
} from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import '../style.css';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import Navibar from './Navibar';
import TaskCreateModal from './TaskCreateModal';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const navigate = useNavigate();
  const { currentUser, logout, currentName, userPhotoURL } = useAuth();

  const fetchTasks = async () => {
    try {
      await currentUser.reload();
      const token = await currentUser.getIdToken(true);

      const response = await fetch(
        'https://tech-incubator-task-api.herokuapp.com/dashboard/tasks/showMyTasks',
        // 'http://localhost:4000/dashboard/tasks/showMyTasks',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
      const data = await response.json();

      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskUpdate = async (taskId, submissionStatus, submissionFile) => {
    try {
      const token = await auth.currentUser.getIdToken(true);
      const response = await fetch(
        `https://tech-incubator-task-api.herokuapp.com/dashboard/tasks/studentUpdate/${taskId}`,
        // `http://localhost:4000/dashboard/tasks/studentUpdate/${taskId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            submissionStatus, // task.submissionStatus
            submissionFile // return current task.submissionCounter
          })
        }
      );

      if (!response.ok) {
        console.log(response);
        throw new Error('Network response was not ok');
      }

      await fetchTasks();
      const updatedTask = await response.json();
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
  const [toggle, setToggle] = useState(true);
  const Toggle = () => {
    setToggle(!toggle);
  };

  return (
    <div className="d-flex tasks">
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
          <h2 className="text-center mb-2">My Tasks</h2>
          {currentName.startsWith('company') && <TaskCreateModal fetchTasks={fetchTasks} />}
        </div>
        <div className="card-container">
          <div className="card-columns">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                handleOpenModal={handleOpenModal}
                profilePhoto={userPhotoURL}
              />
            ))}
            {isModalOpen && selectedTask && (
              <TaskDetailModal
                task={selectedTask}
                show={isModalOpen}
                handleTaskUpdate={handleTaskUpdate}
                onHide={handleCloseModal}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskCard({ task, handleOpenModal }) {
  return (
    <Card
      className="mb-3 card2"
      style={{ borderRadius: '20px' }}
      onClick={() => handleOpenModal(task)}>
      <Card.Img
        variant="top"
        src={task.displayPhoto}
        style={{
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          height: '100px'
        }}
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
            bg={!task.submissionStatus ? 'success' : 'secondary'}
            className="ml-2 rounded-pill bg-opacity-30">
            {task.student && (!task.submissionStatus ? 'In progress' : 'Closed')}
            {!task.student && 'Open'}
          </Badge>
        </div>
      </Card.Footer>
    </Card>
  );
}

function TaskDetailModal({ task, show, onHide, handleTaskUpdate }) {
  const [googleDocLink, setGoogleDocLink] = useState('');
  const { currentName } = useAuth();
  const [submissionStatus, setSubmissionStatus] = useState(false);
  const [hasFile, setHasFile] = useState(false);

  const validateLink = (link) => {
    const regex = /^https:\/\/docs\.google\.com\/.*\/d\/.+$/;
    const test = regex.test(link);
    test ? setHasFile(true) : setHasFile('error');
    return test;
  };

  async function handleStudentSubmit(taskId) {
    if (validateLink(googleDocLink)) {
      await handleTaskUpdate(taskId, submissionStatus, googleDocLink);
      onHide();
    }
  }

  useEffect(() => {
    setSubmissionStatus(task.submissionStatus);
  }, [task]);

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      className="pt-20px"
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

      <ModalFooter id="myTaskAssignment">
        <div>
          Current Submission:
          <a href={task.submissionLink}>{task.submissionLink ? 'here' : ' none'}</a>
          <br />
          Claimed by: {task.student ? `${task.student}` : 'none'}
        </div>
        {currentName.startsWith('student') && (
          <Form.Group className="mb-3">
            <Form.Label>Google Doc Link</Form.Label>
            <Form.Control
              type="text"
              value={googleDocLink}
              onChange={(event) => {
                validateLink(event.target.value);
                setGoogleDocLink(event.target.value);
              }}
              placeholder="Paste Google Doc link here"
            />
            <div>
              {hasFile === 'error' && (
                <Badge bg={'danger'} className="mt-2">
                  Please provide a valid google doc link.
                </Badge>
              )}
            </div>
          </Form.Group>
        )}
      </ModalFooter>
      {currentName.startsWith('student') && (
        <ModalFooter>
          {!task.submissionStatus && (
            <Form.Group>
              <ToggleButtonGroup
                className=" d-flex justify-content-center"
                type="radio"
                name="submissionStatus"
                value={submissionStatus}
                onChange={(value) => setSubmissionStatus(value)}>
                <ToggleButton
                  variant={submissionStatus === 'Complete' ? 'success' : 'outline-primary'}
                  value="finished"
                  onClick={
                    submissionStatus === 'Complete'
                      ? () => setSubmissionStatus(false)
                      : () => setSubmissionStatus('Complete')
                  }>
                  {submissionStatus ? 'Completed' : 'Complete?'}
                </ToggleButton>
              </ToggleButtonGroup>
            </Form.Group>
          )}

          <Button
            variant="primary"
            onClick={() => handleStudentSubmit(task.id)}
            disabled={task.submissionStatus || hasFile === false || hasFile === 'error'}>
            {task.submissionStatus ? 'Submitted' : 'Update'}
          </Button>
        </ModalFooter>
      )}
    </Modal>
  );
}
