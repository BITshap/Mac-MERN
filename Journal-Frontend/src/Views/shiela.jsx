import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from 'react-bootstrap';
import './shiela.css';

const Shiela = () => {
  const location = useLocation();
  const { username, userId, responseText } = location.state || {};
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [responseReady, setResponseReady] = useState(false);

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
    } else if (!userId || !username || !responseText) {  
      const handleNavigation = () => {
        navigate('/');
      };

      const alertTimeout = setTimeout(() => {
        toast.warning("Oops! Looks like you're trying to access a feature a little bit early. Please re-login!"); 
        handleNavigation();
      }, 0);

      return () => clearTimeout(alertTimeout);
    }

    // If all checks pass, set responseReady to true
    setResponseReady(true);
  }, [token, navigate, userId, username, responseText]);

  if (!responseReady) {
    return null; // Return null or a loading indicator while waiting for the response
  }

  const stringResponse = responseText.responseText;

  return (
    <div className='shiela-container'>
    <div id="Welcome_Text">
      <h1>Hello {username}! My name is Shiela, your guide to thought. I try my best to help as much as possible, however please keep in mind I'm not a professional!</h1>
      <h2>Here are some helpful insights:</h2>
      <p>{stringResponse}</p>
    <div id="Custom_Button">
        <Button type="button" onClick={() =>  navigate(`/${username}/logs`, { state: { username, userId} })}>Past Entries</Button>
    </div>
    </div>
    </div>
  );
};

export default Shiela;
