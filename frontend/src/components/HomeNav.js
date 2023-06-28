/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import '../home.css';
import { Link as LinkScroll } from 'react-scroll';
import { Link as LinkRouter } from 'react-router-dom';

export default function HomeNav(path) {
  return (
    <nav className="home-nav">
      <LinkRouter to="/" className="nav-item-left">
        Tech Incubator
      </LinkRouter>
      <div>
        <LinkScroll
          to="focus"
          className="nav-item"
          spy={true}
          duration={800}
          smooth={true}
          offset={-80}
          style={{ cursor: 'pointer' }}>
          Our Focus
        </LinkScroll>
        <LinkScroll
          to="features"
          className="nav-item"
          spy={true}
          duration={800}
          smooth={true}
          offset={-80}
          style={{ cursor: 'pointer' }}>
          Key Features
        </LinkScroll>
      </div>
      <div className="nav-items-right">
        <LinkRouter to="/dashboard" className="nav-item">
          <button className="nav-item nav-item-button">Dashboard</button>
        </LinkRouter>
      </div>
    </nav>
  );
}
