import React from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Submission = () => {
  const location = useLocation();
  const { username } = location.state || {}; // Retrieve the username from location.state or set it to an empty object

  const handleSubmission = async () => {
    try {
      const response = await axios.put(`http://localhost:3001/users/${username}`, { score: username.score + 1 });

      // Handle successful submission

      // Display a success message
      alert('Entry Complete!');
    } catch (error) {
      console.error('Submission failed:', error);
      // Handle submission error
    }
  };

  return (
    <div>
      <h1>Welcome {username}</h1>
      <h2>Have you completed an entry?</h2>
      <form onSubmit={handleSubmission}>
        {/* Submission form fields */}
        <button type="submit">Yes</button> 
      </form>
      <form>
        <button type="submit">No</button>
      </form>
    </div>
  );
};

export default Submission;


//Here is where you're at. Issues with this submission form in passing props. Figure it out. 