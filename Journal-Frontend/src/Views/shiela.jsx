import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from 'react-bootstrap';
import './shiela.css';

const Shiela = () => {
  const location = useLocation();
  const { username, userId, responseText, text } = location.state || {};
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [responseReady, setResponseReady] = useState(false);
  const stringResponse = responseText?.responseText;

  const [chatHistory, setChatHistory] = useState([
    { role: 'user', content: text },
    { role: 'assistant', content: stringResponse },
  ]);

  const [sentChatHistory, setSentChatHistory] = useState([
    { role: 'user', content: text },
    { role: 'assistant', content: stringResponse },
  ]);

  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);

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
    } else if (!userId || !username || !responseText || !text ) {  
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
  }, [token, navigate, userId, username, responseText, text]);

  if (!responseReady) {
    return null; // Return null or a loading indicator while waiting for the response
  }

  //const stringResponse = responseText.responseText;

  async function sendMessageToShiela() {
    try {
      setLoading(true);  // Start a loading spinner or some indicator if you have one

      setChatHistory(prevHistory => [...prevHistory, { role: 'user', content: userInput }]);

      setSentChatHistory(prevHistory => {
        let updatedHistory = [...prevHistory, { role: 'user', content: userInput }];
        while (updatedHistory.length > 3) {
            updatedHistory.shift();
        }
        return updatedHistory;
      });

      // Make the API call
      const response = await fetch('http://localhost:3001/Shielas-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // You'll also need to send your token in the headers if required for verification.
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          text: userInput,
          history: sentChatHistory,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
  
      const responseData = await response.json();
      const newMessage = responseData.responseText;
  
      // Add the user's input and Sheila's response to the chat history
      setChatHistory(prevHistory => [...prevHistory, { role: 'assistant', content: newMessage }]);

      setSentChatHistory(prevHistory => [...prevHistory, { role: 'assistant', content: newMessage }]);

      // Clear the user input field
      setUserInput('');
    } catch (error) {
      console.error("Error sending message to Sheila:", error);
      // Handle error appropriately, e.g., show a toast notification
    } finally {
      setLoading(false); // Stop the loading spinner or indicator
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();  // Prevents the default behavior of Enter.
        sendMessageToShiela();
    }
}

  return (
    <div className='shiela-container'>
    <div id="Welcome_Text">
      <h1>Hello {username}! My name is Shiela, your guide to thought. I try my best to help as much as possible, however please keep in mind I'm not a professional!</h1>
      <div className="chat-window">
    {chatHistory.map((message, index) => (
        <div 
            key={index} 
            className={`message ${message.role}`}
        >
            {message.role === 'assistant' && <span className="message-name">Shiela: </span>}
            {message.content}
        </div>
    ))}
    </div>
      <input value={userInput} onChange={e => setUserInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Type your message..."/>
      <Button onClick={sendMessageToShiela} disabled={loading}>Send</Button>
    <div id="Custom_Button">
        <Button type="button" onClick={() =>  navigate(`/${username}/logs`, { state: { username, userId} })}>Past Entries</Button>
    </div>
    </div>
    </div>
  );
};

export default Shiela;
