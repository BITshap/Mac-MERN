import React, {useState, useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {Button} from 'react-bootstrap';
import RocketSpinner from './RocketSpinner';
import axios from 'axios';

const Logs = () => {
  const location = useLocation();
  const { username, userId } = location.state || {};
  console.log('userId:', userId)
  console.log('Username:', username)
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);



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

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
  };

  useEffect(() => {
    const getLogs = async () => {
      try {
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
      setLoading(false);
    } catch (error) {
      console.error("Error fetching logs:", error);
      setLoading(false);
    }
  };

  getLogs();
}, [token, userId]);

  return (
    <div>
    <h1 id="Welcome_Text"> {username}'s most recent entries:</h1>
    <h2 id="Welcome_Text">Your individual score too: {score}</h2>
     {loading ? (
      <div className="spinner-container">
      <RocketSpinner />
      </div>
      ) : (
        logs.map((log, index) => (
          <div key={index}>
            <p id="Welcome_Text">{log} {formatDate(new Date(timestamps[index]))}</p>
          </div>
        ))
      )}
      <Button onClick={() => navigate('/users')}>Universe</Button>
    </div>
  );
};

export default Logs;

/*logs.map((log, index) => (
  <div key={index}>
    <p id="Welcome_Text">{log} {formatDate(new Date(timestamps[index]))}</p>
  </div>
))

<h1 id="Welcome_Text"> {username}'s most recent entries:</h1>
    <h2 id="Welcome_Text">Your individual score too: {score}</h2>
*/