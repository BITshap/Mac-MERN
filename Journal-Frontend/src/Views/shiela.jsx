import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from 'react-bootstrap';
import './shiela.css';

const baseUrl = process.env.REACT_APP_JOURNAL_ME_API_URL;
console.log(baseUrl)

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
      const response = await fetch(`${baseUrl}/Shielas-response`, {
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
        let errorData = await response.json(); // Parse the error message from the backend
        toast.error(errorData.error); // Display the error message using toast
        return; // Exit the function early to prevent further processing
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
      <div className="Shiela-component-container" id="Welcome_Text">
      <div className='Shiela-Text-Container'>
      <h3>Hello {username}! I'm <span className="shimmer-effect">Sheila AI</span>, your guide to thought. Let's chat.</h3>
      <p className="disclaimer">Sheila is for entertainment purposes only.</p>
      </div>
        <div className='Shiela-Window-Container'>
          <div className="chat-window red-outine">
              {chatHistory.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
                {message.role === 'assistant' && <span className="message-name">Shiela: </span>}
                {message.content}
              </div>
              ))}
          </div>
            <div className="Shiela-Button-Wrap">
                  <input id="text-box" value={userInput} onChange={e => setUserInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Continue to chat.."/>
                  <Button className="linky-button" onClick={sendMessageToShiela} disabled={loading}>Send</Button>
                  <Button type="button" className="linky-button" onClick={() =>  navigate(`/${username}/logs`, { state: { username, userId} })}>Logs</Button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Shiela;
