import React from 'react';
import '../home.css';
import Arrow from './assets/Arrow1.png';
import Arrow2 from './assets/Arrow2.png';
import { Link as LinkScroll } from 'react-scroll';
import { Link as LinkRouter } from 'react-router-dom';

export default function HomeHero() {
  return (
    <div className="home-hero" id="focus">
      <div className="hero-left-bubble">
        <div className="bubble-baby-1">
          <p>Become a company that leads</p>
          <div className="baby-1-text">
            Foster the growth of students by providing real world experience through projects and
            tasks.
          </div>
        </div>
        <div className="hero-bottom-left">
          <div className="bubble-baby-2">
            <LinkRouter to="/login" className="bubble-baby-2">
              <p>Register Now</p>
              <img src={Arrow} className="arrow-1"></img>
            </LinkRouter>
          </div>
          <LinkScroll
            to="features"
            smooth="true"
            spy={true}
            duration={800}
            style={{ cursor: 'pointer' }}>
            <div className="bubble-baby-3">
              <img src={Arrow2} className="arrow-2"></img>
              <p>Learn more</p>
            </div>
          </LinkScroll>
        </div>
      </div>
      <div className="hero-right-bubble">
        <p>Learn as a student and grow your network</p>
        <div className="baby-2-text">
          Create opportunity for companies in need, opportunity for yourself, and learn new things
          along the way.
        </div>
      </div>
    </div>
  );
}
