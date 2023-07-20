import React, {useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {Button} from 'react-bootstrap';
//import axios from 'axios';

const Shiela = () => {
  const location = useLocation();
  const { username, userId, responseText} = location.state || {};
  const navigate = useNavigate();
  console.log(userId)
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


  //const responseToString = JSON.stringify(responseText)
  const stringResponse = responseText.responseText
  console.log(stringResponse)
  return (
    <div id="Welcome_Text">
      <h1>Hello {username}! My name is Shiela, your guide to thought. I try my best to help as much as possible, however please keep in mind I'm not a professional!</h1>
      <h2>Here are some possible helpful insights:</h2>
      <p>{stringResponse}</p>
    <div id="Custom_Button">
        <Button type="button" onClick={() =>  navigate(`/${username}/logs`, { state: { username, userId} })}>Past Entries</Button>
    </div>
    </div>
  );
};

export default Shiela;