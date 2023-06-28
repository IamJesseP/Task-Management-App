import React from 'react';
import '../home.css';
import { Link } from 'react-router-dom';
export default function HomeNav() {
  return (
    <nav className="home-nav">
      <Link to="/home" className="nav-item-left">
        Tech Incubator
      </Link>
      <div>
        <a href="#" className="nav-item">
          Our Focus
        </a>
        <a href="#" className="nav-item">
          Key Features
        </a>
      </div>
      <div className="nav-items-right">
        <Link to="/login" className="nav-item">
          <button className="nav-item nav-item-button">Dashboard</button>
        </Link>
      </div>
    </nav>
  );
}
