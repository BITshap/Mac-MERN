import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Users = () => {
  const [documents, setDocuments] = useState([]);

  const token = localStorage.getItem('token');

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

  return (
    <div>
      <h2>Top Entries</h2>
      <ul>
        {documents.map(document => (
          <li key={document.name}>{JSON.stringify(document.name + ": " + document.score).slice(1, -1)}</li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
