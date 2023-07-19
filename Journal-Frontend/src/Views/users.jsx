import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom'
import axios from 'axios';

const Users = () => {
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate()
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

  useEffect(() => {
    
    // Make a GET request to your backend API
    axios.get('http://localhost:3001/users', {
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
      });
  }, [token]);

  const sortedDocuments = documents.sort((a, b) => b.score - a.score)
  return (
    <div>
      <h2 id="Welcome_Text">Top Entries</h2>
      <ul id="Welcome_Text">


        {sortedDocuments.map(document => (
          <li key={document.name}>{JSON.stringify(document.name + ": " + document.score).slice(1, -1)}</li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
