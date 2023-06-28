import React from 'react';
import HomeNav from './HomeNav';
import '../home.css';
import HomeHero from './HomeHero';

export default function Home() {
  return (
    <>
      <HomeNav />
      <HomeHero />
      <div className="home-focus">
        <h1>What we do:</h1>
        <div className="focus-summary">
          <div className="focus-section-1">test</div>
          <div className="focus-section-2">test</div>
        </div>
      </div>
    </>
  );
}
