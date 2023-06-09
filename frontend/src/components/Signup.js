import React, { useRef, useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, updateProfile } from 'firebase/auth';

export default function Signup() {
  // useRef is used to access the value of the input fields without constant re-renders
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const userNameRef = useRef();
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const { signup, currentUser } = useAuth();
  const auth = getAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    // Validators
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Passwords do not match');
    }
    if (passwordRef.current.value.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    try {
      setError('');
      setLoading(true);
      // Try to create an account, pull credential
      const userCredential = await signup(emailRef.current.value, passwordRef.current.value);
      const user = userCredential.user;
      // Add userName to account
      await updateProfile(user, {
        displayName: userNameRef.current.value
      });
      navigate('/');
    } catch (error) {
      setError('Failed to create an account');
      console.log(error);
    }

    setLoading(false);
  }

  return (
    <div
      className="d-flex"
      style={{
        minHeight: '100vh'
      }}>
      {
        //not completely responsive
      }
      <Card
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: '20vh', margin: 'auto', maxWidth: '400px' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Sign Up</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="userName">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" ref={userNameRef} required />
            </Form.Group>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control type="password" ref={passwordConfirmRef} required />
            </Form.Group>
            <Button disabled={loading} className="w-100 mt-4 mb-4" type="submit">
              Sign Up
            </Button>
          </Form>
        </Card.Body>
        <div className=" text-center d-flex" style={{ marginBottom: '-32px' }}>
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </Card>
    </div>
  );
}
