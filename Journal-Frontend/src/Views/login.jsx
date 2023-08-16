/*import React, { useState } from 'react';
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
      <h1 id="Welcome_Text">Welcome to JournalMe.AI</h1>
      <h2 id="Welcome_Text">Login</h2>
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
*/

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Button, Nav, Row, Col } from 'react-bootstrap';
import './CombinedForm.css';

const CombinedForm = () => {
  const [isLogin, setIsLogin] = useState(true);  // Default to login
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setUserEmail] = useState('')
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const userData = isLogin ? 
      { username, password } :
      { name, last_name: lastName, email, username, password };

    const url = isLogin ? 'http://localhost:3001/login' : 'http://localhost:3001/signup';

    try {
      const response = await axios.post(url, userData);

      if (isLogin) {
        const tokenValue = response.data.token; 
        // Save the token or session ID received from the response to authenticate subsequent requests
        
        localStorage.setItem('token', tokenValue);
  
        const userId = response.data._id;
        const score = response.data.score;
        console.log('Your Score:', score)
        console.log('Your Id:', userId);
  
        // Redirect to the next page or allow access to protected routes
        navigate('/submission', {state: {username, userId, score}})
      } else {
        console.log('Signup successful!');
        setIsLogin(true);  // Switch to login after successful signup
      }
    } catch (error) {
      console.error(isLogin ? 'Login error:' : 'Signup error:', error);
    }
  };

  return (
    <Container className="container-center">
      <Col xs={12} md={6} className="form-column">
        <h1 id="Welcome_Text">{isLogin ? 'Login to JournalMe.AI' : 'Signup for JournalMe.AI'}</h1>
        <Nav variant="tabs" activeKey={isLogin ? "/login" : "/signup"} onSelect={(selectedKey) => setIsLogin(selectedKey === "/login")}>
          <Nav.Item>
            <Nav.Link eventKey="/login">Login</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="/signup">Signup</Nav.Link>
          </Nav.Item>
        </Nav>
        <Form onSubmit={handleFormSubmit}>
          {!isLogin && (
            <Row>
              <Col xs={12} className="form-control-margin">
                <Form.Control type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
              </Col>
              <Col xs={12} className="form-control-margin">
                <Form.Control type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </Col>
              <Col xs={12} className="form-control-margin">
                <Form.Control type="text" placeholder="Email" value={email} onChange={(e) => setUserEmail(e.target.value)} />
              </Col>
            </Row>
          )}
          <Row>
            <Col xs={12} className="form-control-margin">
              <Form.Control type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </Col>
            <Col xs={12} className="form-control-margin">
              <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Col>
            <Col xs={12} className="form-control-margin">
              <Button type="submit" className="full-width-btn">{isLogin ? 'Login' : 'Signup'}</Button>
            </Col>
          </Row>
        </Form>
      </Col>
    </Container>
  );
};

export default CombinedForm;

