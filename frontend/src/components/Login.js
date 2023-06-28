import React, { useRef, useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import '../home.css';

export default function Login() {
  // useRef is used to access the value of the input fields without constant re-renders
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  const { login, currentUser } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    // Try to create an account
    try {
      setError('');
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to log in');
    }

    setLoading(false);
  }

  return (
    <>
      <nav className="home-nav">
        <Link to="/" className="nav-item-left">
          Tech Incubator
        </Link>
      </nav>
      <div
        className="d-flex align-items-center justify-content-center"
        style={{
          minHeight: '100vh'
        }}>
        <Card
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: '20vh', margin: 'auto', maxWidth: '400px' }}>
          <Card.Body>
            <h2 className="text-center mb-4">Log In</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" ref={emailRef} required />
              </Form.Group>
              <Form.Group id="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" ref={passwordRef} required />
              </Form.Group>
              <Button disabled={loading} className="w-100 mt-4" type="submit">
                Log In
              </Button>
            </Form>
            <div className="w-100 text-center mt-3">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
          </Card.Body>
          <div className="text-center d-flex" style={{ marginBottom: '-32px' }}>
            Need an account? <Link to="/signup">Sign Up</Link>
          </div>
        </Card>
      </div>
    </>
  );
}
