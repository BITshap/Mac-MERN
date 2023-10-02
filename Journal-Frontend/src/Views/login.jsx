import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Button, Nav, Row, Col} from 'react-bootstrap';
import { toast, ToastContainer} from 'react-toastify';
import RocketSpinner from './RocketSpinner';
import Filter from "bad-words";
import './CombinedForm.css';


const CombinedForm = () => {
  const [isLogin, setIsLogin] = useState(true);  // Default to login
  const [name, setName] = useState('');
  const [email, setUserEmail] = useState('')
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const [showLoader, setShowLoader] = useState(false);

  const navigate = useNavigate();
  const filter = new Filter();

  const toastOptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  const toastOptionsLong = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin) {  // For signup
      if (filter.isProfane(name) || filter.isProfane(username)) {
        toast.error("Let's keep it classy! Please use a different name or username.", toastOptions);
        return;
      }
      
      if (name.trim() === '') {
        toast.error('Hey there! What should we call you?', toastOptions);
        return;
      } else if (email.trim() === '') {
        toast.error('Share your email with us and stay connected!', toastOptions);
        return;
      } else if (!validateEmail(email)) {
        toast.error('Drop us a line! And by line, we mean a valid email address.', toastOptions);
        return;
      } else if (username.trim() === '') {
        toast.error('Oops! Seems like you forgot to enter a username.', toastOptions);
        return;
      } else if (password.trim() === '') {
        toast.error('Almost there! Please set a password to secure your account.', toastOptions);
        return;
      } else if (!agreeToTerms) { 
        toast.error('By agreeing, you authorize JournalMe to store your logs for only you and the service to see.', toastOptionsLong);
        return;
      }
    }
    
    // For both login and signup
    if (username.trim() === '') {
      toast.error("Ah, those times when our usernames were everything! Brings back memories, right?", toastOptions);
      return;
    } else if (password.trim() === '') {
      toast.error("Where's your almighty password?", toastOptions);
      return;
    }
    

    const userData = isLogin ? 
      { username, password } :
      { name, email, username, password, termsAccepted: agreeToTerms };

    const url = isLogin ? 'http://localhost:3001/login' : 'http://localhost:3001/signup';

    if (!isLogin) {
      setShowLoader(true);  // Show loader before signup request
    }

    try {

      const response = await axios.post(url, userData);

      if (isLogin) {
      const tokenValue = response.data.token; 
    // Save the token or session ID received from the response to authenticate subsequent requests
      localStorage.setItem('token', tokenValue);

      const userId = response.data._id;
      const score = response.data.score;
    // Update states
      setShowLoader(true); 
      setTimeout(() => {
        setShowLoader(false);
        navigate('/submission', { state: { username, userId, score} });
    }, 1500);
  
      } else {
        console.log('Signup successful!');
        toast.success('Nice to have you ' + username + ' ✨', toastOptions);
        setShowLoader(false);
        setIsLogin(true);  // Switch to login after successful signup
      }
    } catch (error) {
      setShowLoader(false);
      console.error(isLogin ? 'Login error:' : 'Signup error:', error);

      if (isLogin) {
        toast.error('Invalid username or password.', toastOptions);
      } else {
        // If it's a signup error, then we inspect the errorType from the backend
        switch (error.response.data.errorType) {
          case 'INAPPROPRIATE_CONTENT': 
            toast.error("Let's keep it classy! Please use a different name or username.", toastOptions);
            break;
          case 'NAME_EXISTS': 
            toast.error('A user with this name already exists.', toastOptions);
            break;
          case 'USERNAME_EXISTS': 
            toast.error('A user with this username already exists.', toastOptions);
            break;
          case 'EMAIL_EXISTS': 
            toast.error('A user with this email already exists.', toastOptions);
            break;
          case 'TERMS_NOT_ACCEPTED': 
            toast.error('Please allow JournalMe to keep your logs for only you to see.', toastOptions);
            break;
          default:
            toast.error('An error occurred during signup. Please try again.', toastOptions);
        }
      }
    }
  };
    


  return (
    <>
    <ToastContainer />
    {/* Main Content */}
    <Container className="container-center red-outline">
      <Row className="mb-3">
        <Col xs={12} md={6} className="form-column mb-300 mb-275-lg">
            <h1 id="Welcome_Text" className="center-text">{isLogin ? 'Welcome back to ' : 'SignUp for '} <span className="shimmer-effect">JournalMe</span></h1>
            <Nav className="justify-content-center custom-nav" activeKey={isLogin ? "/login" : "/signup"} onSelect={(selectedKey) => setIsLogin(selectedKey === "/login")}>
                <Nav.Item>
                    <Nav.Link eventKey="/login">Login</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="/signup">Create Account</Nav.Link>
                </Nav.Item>
            </Nav>
            <Form onSubmit={handleFormSubmit} className="form-styling">
                {!isLogin && (
                <Row className="g-2 mb-2">
                    <Col xs={12} md={6}>
                        <Form.Control type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                    </Col>
                    <Col xs={12} md={6} className="form-control-margin">
                        <Form.Control type="text" placeholder="Email" value={email} onChange={(e) => setUserEmail(e.target.value)} />
                    </Col>
                </Row>
                )}
                <Row className="g-2 mb-3">
                    <Col xs={12} md={6} className="form-control-margin">
                        <Form.Control type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </Col>
                    <Col xs={12} md={6}className="form-control-margin">
                        <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </Col>
                    {!isLogin && (
                  <Row className="g-2 mb-3">
                    <Col xs={12} id="Welcome_Text" className="form-control-margin">
                      <Form.Check
                        className="custom-checkbox" 
                        type="checkbox"
                        label={<span className="semi-bold">Allow JournalMe to use your Data for the purpose of a personalized service</span>}
                        checked={agreeToTerms} 
                        onChange={() => setAgreeToTerms(!agreeToTerms)}
                      />
                    </Col>
                  </Row>
                  )}
                    <Col xs={12} className="form-control-margin">
                        <Button type="submit" className="login-button linky-button">{isLogin ? 'Enter' : 'Signup'}</Button>
                    </Col>
                </Row>
            </Form>
        </Col>
        {/* Spinner */}
        <Col xs={12} md={6} className="login-spinner align-items-center d-flex justify-content-center red-outline">
            {showLoader && 

                <RocketSpinner onAnimationComplete={() => {
                    setShowLoader(false);
                }} />
                
            }
        </Col>
      </Row>
    </Container>
    </>
);
};

export default CombinedForm;



/*
Original JSX Before Spinner etc. 

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