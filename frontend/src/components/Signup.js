import React, { useRef, useState } from 'react';
import { Form, Button, Card, Alert, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, updateProfile } from 'firebase/auth';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function Signup() {
  // form inputs
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const userNameRef = useRef();
  const [profilePicFile, setProfilePicFile] = useState();

  //state handlers
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [accountType, setAccountType] = useState('student'); // Default account type is student

  const navigate = useNavigate();
  const { signup, currentUser } = useAuth();
  const auth = getAuth();

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

      const userCredential = await signup(emailRef.current.value, passwordRef.current.value);
      const user = userCredential.user;

      const profilePicRef = ref(storage, `profilePics/${user.uid}`);
      await uploadBytes(profilePicRef, profilePicFile);
      const profilePicURL = await getDownloadURL(profilePicRef);

      let userName = `${accountType}.${userNameRef.current.value}`;
      await updateProfile(user, {
        displayName: userName,
        photoURL: profilePicURL
      });
      await user.reload();
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
      <Card
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: '20vh', margin: 'auto', maxWidth: '400px' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Sign Up</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <ToggleButtonGroup
            className="mb-3 d-flex justify-content-center"
            type="radio"
            name="accountType"
            value={accountType}
            onChange={(value) => setAccountType(value)}>
            <ToggleButton
              variant={accountType === 'student' ? 'primary' : 'outline-primary'}
              value="student"
              onClick={() => setAccountType('student')}>
              Student
            </ToggleButton>
            <ToggleButton
              variant={accountType === 'company' ? 'primary' : 'outline-primary'}
              value="company"
              onClick={() => setAccountType('company')}>
              Company
            </ToggleButton>
          </ToggleButtonGroup>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Profile Picture</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setProfilePicFile(e.target.files[0])}
                accept="image/*"
                required
              />
            </Form.Group>
            <Form.Group id="userName">
              <Form.Label>{accountType === 'student' ? 'Student Name' : 'Company Name'}</Form.Label>
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
