import React, {useEffect} from 'react';
import {useLocation, useNavigate } from 'react-router-dom';
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

  const handleSubmission = async (event) => {
    event.preventDefault();

    try {
      const updatedScore = score + 1;
      console.log(updatedScore)

      await axios.put(
        `http://localhost:3001/users/${userId}`,
        { score: updatedScore },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      // Handle successful submission
      alert('Entry Complete!');
      navigate('/users');
    } catch (error) {
      console.error('Submission failed:', error);
      // Handle submission error
    }
  };

  return (
    <div>
      <h1>Welcome {username}!</h1>
      <h2>Feel free to write down some thoughts..</h2>
      <input></input>
      <h3>Have you completed an entry?</h3>
      <form onSubmit={handleSubmission}>
        {/* Submission form fields */}
        <button type="submit">Yes</button>
        <button type="button">No</button>
      </form>
    </div>
  );
};

export default Submission;


//Here is where you're at. Issues with this submission form in passing props. Figure it out. 