import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom'
import axios from 'axios';
import RocketSpinner from './RocketSpinner';

const Users = () => {
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


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

  useEffect(() => {
    
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
  }, [token]);


  return (
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
  )
};


export default Users;





