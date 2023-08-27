import React, { useEffect, useState } from 'react';
import {useLocation, useNavigate} from 'react-router-dom'
import {Button} from 'react-bootstrap'
import {toast} from 'react-toastify';
import axios from 'axios';
import RocketSpinner from './RocketSpinner';

const Users = () => {
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const { userId, username, score } = location.state || {};


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
        toast.warning("Oops! Looks like you're trying to access a feature a little bit early. Please re-login!");
        handleNavigation();
      }, 0);

      return () => clearTimeout(alertTimeout);
    }

    // Make a GET request to your backend API
    axios.get('http://localhost:3001/top-users', {
      headers: {
        Authorization: `${token}`,
      },
    })
      .then(response => {
        // Update the state with the retrieved documents
        setDocuments(response.data);
      })
      .catch(error => {
        console.error('Failed to fetch documents:', error);
        setError("Failed to load data. Please try again.")
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token, navigate, userId, username, score]);

  //navigate back
  const handleBackToLogs = () => {
    navigate(`/${username}/logs`, { state: { userId, username, score} });
  };


  return (
    <div>
    <div>
    <h2 id="Welcome_Text">Top Users</h2>
      {loading ? (
        <RocketSpinner />
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ul id="Welcome_Text">
          {documents.map((document, index) => {
            let stars = "";
            if (index === 0) stars = " ✨ ✨ ✨ ";          
            else if (index === 1) stars = " ✨ ✨ ";       
            else if (index === 2) stars = " ✨ ";        
            
            return (
              <li key={document._id} style={{fontWeight: index < 3 ? 'bold' : 'normal'}}>
                {`${document.name}: ${document.score}`}{stars}
              </li>
            );
          })}
          {documents.length < 10 && 
            Array(10 - documents.length).fill().map((_, idx) => (
              <li key={idx}>Pending...</li>
          ))}
        </ul>
      )}
    </div>
    <div>
      <Button type="button" onClick={handleBackToLogs}>
        Logs
      </Button>
    </div>
    </div>
  )
};


export default Users;





