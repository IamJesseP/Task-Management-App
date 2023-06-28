import React from 'react';
import '../home.css';
import { Link as LinkScroll } from 'react-scroll';
import { Link as LinkRouter } from 'react-router-dom';

export default function HomeFeatures() {
  return (
    <div className="home-features" id="features">
      <h2 style={{ margin: '30px 30px', alignSelf: 'center' }}>
        A pipeline for companies and students
      </h2>
      <div className="features-summary">
        <div className="features-section-1">
          <h3>Companies can</h3>
          <ul>
            <li>Create tasks shared in a marketplace for students</li>
            <li>Get real-time updates on tasks</li>
            <li>Connect with students who claim their tasks</li>
            <li>Contribute to student growth with feedback</li>
          </ul>
        </div>
        <div className="features-section-2">
          <h3>Students can</h3>
          <ul>
            <li>View a marketplace of tasks from companies</li>
            <li>Claim tasks and connect with companies</li>
            <li>Update task status, upload task submissions</li>
            <li>Recieve feedback from companies</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
