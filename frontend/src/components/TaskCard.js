/* eslint-disable react/prop-types */
import React from 'react';
import { Card, Button, Alert, ListGroup, Badge } from 'react-bootstrap';
import '../style.css';

export default function TaskCard({ task }) {
  return (
    <>
      <Card key={task.id} className="bg-light mb-3">
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
    </>
  );
}
