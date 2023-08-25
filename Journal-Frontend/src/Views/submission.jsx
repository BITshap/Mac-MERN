import React, {useState, useEffect, useRef} from 'react';
import {useLocation, useNavigate } from 'react-router-dom';
import {Button} from 'react-bootstrap'
import {toast} from 'react-toastify';
import RocketSpinner from './RocketSpinner';
import axios from 'axios';

const Submission = () => {
  const location = useLocation();
  const { username, userId, score } = location.state || {};
  console.log('userId:', userId);
  console.log('Current Score:', score)
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      const handleNavigation = () => {
        navigate('/');
      };

      const alertTimeout = setTimeout(() => {
        toast.error('Ground control to Major Tom, we must login!');
        handleNavigation();
      }, 0);

      return () => clearTimeout(alertTimeout);
    } else if (!userId || !username || score === undefined) {
      const handleNavigation = () => {
        navigate('/');
      };

      const alertTimeout = setTimeout(() => {
        toast.warning('Please go through the normal process and provide necessary data!');
        handleNavigation();
      }, 0);

      return () => clearTimeout(alertTimeout);
    }
  }, [token, userId, username, score, navigate]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmission(null, 'analyze');
      event.preventDefault();
    }
  }

  const [text, setText] = useState('');

  const handleSubmission = async (event, action) => {
    if (event) {
      event.preventDefault();
    }

    try {
      const updatedScore = score + 1;

      console.log(updatedScore)

      const now = new Date().toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      });;

      /*const response = await axios.get(`http://localhost:3001/users`);
      const users = response.data;
      const user = users.find((user) => user._id === userId);
  
      const updatedLogs = [...user.logs, text];
      const updatedTimestamps = [...user.timestamps, now]; */

      await axios.put(
        `http://localhost:3001/users/${userId}`,
        { 
          score: updatedScore,
          timestamp: now,
          text: text,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (action === 'analyze') {
        setLoading(true);

        const response = await axios.post('http://localhost:3001/Shielas-response', 
          {
            text: text,
          },
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        setLoading(false);

        navigate('/shiela-response', { state: { responseText: response.data, username, userId} });
      } else {
        navigate(`/${username}/logs`, { state: { username, userId} });
      }
   } catch (error) {
      console.error('Submission failed:', error);
      setLoading(false);
      // Handle submission error
    }
  };

  if (loading) {
    return(
    <RocketSpinner />
    );
  }

  return (
    <div>
      <h1 id="Welcome_Text">Welcome {username}!</h1>
      <h2 id="Welcome_Text">Feel free to write down some thoughts..</h2>
      <textarea ref={inputRef} value={text} onChange={(e) => setText(e.target.value)} onKeyDown={handleKeyDown}/>
      <h3 id="Welcome_Text">Have you completed an entry?</h3>
      <form onSubmit={handleSubmission}>
        {/* Submission form fields */}
        <Button type="button" onClick={() => handleSubmission(null, 'analyze')}>AnalyzeMe</Button>
        <Button type="submit">Go to Entries</Button>
      </form>
    </div>
  );
};

export default Submission;


//Here is where you're at. Issues with this submission form in passing props. Figure it out. 