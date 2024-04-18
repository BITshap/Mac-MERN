import React from 'react';
import RocketSpinner from './RocketSpinner'; 

const Guts = () => {
  return (
    <div className="container loader">
      <div className="content">
        <h1>Keep on Journaling! You got this!</h1>
        <h1>Nick was very fond of this project, and it was a proud build. He moved on to other projects, however, is still reachable by clicking the space shuttle below. See you fellow travla!</h1>
        <div className="spinner-container">

          
          <a href="mailto:nicholasshapoff@gmail.com" style={{ textDecoration: 'none' }}>
            <RocketSpinner />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Guts;
