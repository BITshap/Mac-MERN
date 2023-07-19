import React, {useState, useEffect} from 'react';
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

  const [text, setText] = useState('');

  const handleSubmission = async (event) => {
    event.preventDefault();

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

      // Handle successful submission
      navigate(`/${username}/logs`, {state: {username, userId, score}});
    } catch (error) {
      console.error('Submission failed:', error);
      // Handle submission error
    }
  };

  return (
    <div>
      <h1 id="Welcome_Text">Welcome {username}!</h1>
      <h2 id="Welcome_Text">Feel free to write down some thoughts..</h2>
      <input value={text} onChange={(e) => setText(e.target.value)}/>
      <h3 id="Welcome_Text">Have you completed an entry?</h3>
      <form onSubmit={handleSubmission}>
        {/* Submission form fields */}
        <Button type="submit">Yes</Button>
        <Button type="button">No</Button>
      </form>
    </div>
  );
};

export default Submission;


//Here is where you're at. Issues with this submission form in passing props. Figure it out. 