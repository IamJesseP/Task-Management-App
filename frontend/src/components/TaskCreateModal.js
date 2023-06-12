/* eslint-disable react/prop-types */
import React, { useRef, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

function TaskCreateModal({ fetchTasks }) {
  const [show, setShow] = useState(false);
  const taskTitle = useRef();
  const taskDescription = useRef();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { currentUser, logout, currentName, userPhotoURL } = useAuth();

  const handleSubmit = async () => {
    try {
      const token = await currentUser.getIdToken(true);
      const response = await fetch(`http://localhost:4000/dashboard/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: taskTitle.current.value,
          description: taskDescription.current.value
        })
      });
      if (!response.ok) {
        console.log('test');
      }

      const createdTask = await response.json();
      console.log(createdTask);
      return createdTask;
    } catch (error) {
      console.error('Error:', error);
    } finally {
      handleClose();
      fetchTasks();
    }

    handleClose();
  };

  return (
    <>
      <Button variant="primary" style={{ maxWidth: '250px' }} onClick={handleShow}>
        Create Task
      </Button>
      <Modal show={show} style={{ borderRadius: '20px' }} onHide={handleClose}>
        <Modal.Header
          style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}
          closeButton>
          <Modal.Title>Create New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ borderRadius: '20px' }}>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Task Title</Form.Label>
              <Form.Control type="text" placeholder="Enter task title" ref={taskTitle} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Task Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter task description"
                ref={taskDescription}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default TaskCreateModal;
