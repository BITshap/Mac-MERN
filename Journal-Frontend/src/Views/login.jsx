import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Button, Nav, Row, Col} from 'react-bootstrap';
import { toast, ToastContainer} from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import Filter from "bad-words";
import './CombinedForm.css';


const CombinedForm = () => {
  const [isLogin, setIsLogin] = useState(true);  // Default to login
  const [name, setName] = useState('');
  const [email, setUserEmail] = useState('')
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState(null);
  const [score, setScore] = useState(null);
  const [showRocketAnimation, setShowRocketAnimation] = useState(false);
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
      { name, email, username, password };

    const url = isLogin ? 'http://localhost:3001/login' : 'http://localhost:3001/signup';

    try {
      const response = await axios.post(url, userData);

      if (isLogin) {
        const tokenValue = response.data.token; 
        // Save the token or session ID received from the response to authenticate subsequent requests
        localStorage.setItem('token', tokenValue);

        setShowRocketAnimation(true);

        setUserId(response.data._id);
        setScore(response.data.score);
        console.log('Your Score:', score)
        console.log('Your Id:', userId);
  
      } else {
        console.log('Signup successful!');
        toast.success('Nice to have you ' + username + ' ✨', toastOptions);
        setIsLogin(true);  // Switch to login after successful signup
      }
    } catch (error) {
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
          default:
            toast.error('An error occurred during signup. Please try again.', toastOptions);
        }
      }
    }
  };
    


  return (
    <>
    <AnimatePresence>
  {showRocketAnimation && (
    <div className="rocket-container">
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: -250, opacity: 1 }}
      exit={{ y: -500, opacity: 0 }}
      transition={{ duration: 1.5 }}
      onAnimationComplete={() => {
        setShowRocketAnimation(false);
        // Lazy load your next component or navigate
        navigate('/submission', {state: {username, userId, score}});
      }}
    >
      🚀
      <motion.span
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1, scale: [1, 1.5, 1] }}
        transition={{
          repeat: Infinity,
          repeatType: 'reverse',
          duration: 0.5,
        }}
      >
        ●
      </motion.span>
    </motion.div>
    </div>
  )}
</AnimatePresence>
    <ToastContainer />
    <Container className="container-center">
      <Col xs={12} md={6} className="form-column">
        <h1 id="Welcome_Text">{isLogin ? 'Welcome back to JournalMe' : 'SignUp for JournalMe'}</h1>
        <Nav variant="tabs" activeKey={isLogin ? "/login" : "/signup"} onSelect={(selectedKey) => setIsLogin(selectedKey === "/login")}>
          <Nav.Item>
            <Nav.Link eventKey="/login">Login</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="/signup">Create Account</Nav.Link>
          </Nav.Item>
        </Nav>
        <Form onSubmit={handleFormSubmit}>
          {!isLogin && (
            <Row>
              <Col xs={12} className="form-control-margin">
                <Form.Control type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
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
    </>
  );
};

export default CombinedForm;



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