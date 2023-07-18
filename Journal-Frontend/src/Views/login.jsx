import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Button} from 'react-bootstrap'

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to the backend API
      const response = await axios.post('http://localhost:3001/login', { username, password });

      // Handle successful login

      const tokenValue = response.data.token; 
      // Save the token or session ID received from the response to authenticate subsequent requests
      
      localStorage.setItem('token', tokenValue);

      const userId = response.data._id;
      const score = response.data.score;
      console.log('Your Score:', score)
      console.log('Your Id:', userId);

      // Redirect to the next page or allow access to protected routes
      navigate('/submission', {state: {username, userId, score}})
    } catch (error) {
      console.error('Login failed:', error);
      // Handle login error
    }
  };

  return (
    <div>
      <Container>
      <h1>Welcome to JournalMe.AI</h1>
      <h2>Login</h2>
      <Form onSubmit={handleLogin}>
        <Form.Control
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Form.Control
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">Login</Button>
      </Form>
      </Container>
    </div>
  );
};

export default LoginForm;
