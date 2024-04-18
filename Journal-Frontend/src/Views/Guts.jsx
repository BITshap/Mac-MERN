import React from 'react';
import RocketSpinner from './RocketSpinner'; 

const Guts = () => {
  return (
    <div className="container loader">
      <div className="content">
        <h1>Keep Journaling!</h1>
        <h1>Nick was proud of this project, and happy with his first build. He moved onto other stations, however, he is still reachable by clicking the button below.</h1>
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
