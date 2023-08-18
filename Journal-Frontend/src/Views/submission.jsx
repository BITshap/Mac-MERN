import React, {useState, useEffect, useRef} from 'react';
import {useLocation, useNavigate } from 'react-router-dom';
import {Button} from 'react-bootstrap'
import axios from 'axios';

const Submission = () => {
  const location = useLocation();
  const { username, userId, score} = location.state || {};
  console.log('userId:', userId);
  console.log('Current Score:', score)
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const inputRef = useRef(null);

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
        navigate('/shiela-response', { state: { responseText: response.data, username, userId} });
      } else {
        navigate(`/${username}/logs`, { state: { username, userId} });
      }
   } catch (error) {
      console.error('Submission failed:', error);
      // Handle submission error
    }
  };

  return (
    <div>
      <h1 id="Welcome_Text">Welcome {username}!</h1>
      <h2 id="Welcome_Text">Feel free to write down some thoughts..</h2>
      <input ref={inputRef} value={text} onChange={(e) => setText(e.target.value)} onKeyDown={handleKeyDown}/>
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