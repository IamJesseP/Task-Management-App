import React from 'react';
import HomeNav from './HomeNav';
import '../home.css';
import HomeHero from './HomeHero';
import HomeFeatures from './HomeFeatures';

export default function Home() {
  return (
    <>
      <HomeNav path={'home'} />
      <HomeHero />
      <HomeFeatures />
    </>
  );
}
