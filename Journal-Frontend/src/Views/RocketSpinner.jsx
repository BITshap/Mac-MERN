import React from 'react';
import './RocketSpinner.css';

const RocketSpinner = () => {
    return (
        <div className="loader">
            <div className="rocket"> 
                <i className="fas fa-rocket"></i>
                <i className="fas fa-cloud" style={{'--i': 0}}></i>
                <i className="fas fa-cloud" style={{'--i': 1}}></i>
                <i className="fas fa-cloud" style={{'--i': 2}}></i>
                <i className="fas fa-cloud" style={{'--i': 3}}></i>
            </div>
            <span><i></i></span>
        </div>
    );
};

export default RocketSpinner;
