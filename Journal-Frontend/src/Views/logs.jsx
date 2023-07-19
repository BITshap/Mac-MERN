import React, {useState, useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {Button} from 'react-bootstrap';
import axios from 'axios';

const Logs = () => {
  const location = useLocation();
  const { username, userId } = location.state || {};
  console.log('userId:', userId)
  console.log('Username:', username)
  const navigate = useNavigate();


  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      const handleNavigation = () => {
        navigate('/');
      };
  
      const alertTimeout = setTimeout(() => {
        alert('Authorization is required. Please log in.');
        handleNavigation();
      }, 0);
  
      return () => clearTimeout(alertTimeout);
    }
  }, [token, navigate]);

  const [logs, setLogs] = useState([]);
  const [timestamps, setTimestamps] = useState([])
  const [score, setScore] = useState(0)

  useEffect(() => {
    const getLogs = async () => {
      const response = await axios.get(`http://localhost:3001/users/${userId}/logs`, {
        headers: {
            Authorization: `${token}`
        }
      });
      const logs = response.data.logs;
      const timestamps = response.data.timestamps;
      const score = response.data.newScore;
      console.log(logs)
      console.log(timestamps)
      console.log('Updated Score:' + score)
      setScore(score)
      setLogs(logs);
      setTimestamps(timestamps)
    };

    getLogs();
  }, [token, userId]);

  
  return (
    <div id="Welcome_Text">
    <h1 id="Welcome_Text"> {username}'s most recent entries:</h1>
    <h2 id="Welecom_Text">Your individual score too: {score}</h2>
     {/* Display logs */}
      {logs.map((log, index) => (
        <div key={index}>
          <p>Log: {log}</p>
          <p>Timestamp: {timestamps[index]}</p>
        </div>
      ))} 
      <Button onClick={() => navigate('/users')}>Let's see our Users</Button>
    </div>
  );
};

export default Logs;

