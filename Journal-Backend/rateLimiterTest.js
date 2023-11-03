/*const axios = require('axios');
const env = require('./.env');
const jwt = require('jsonwebtoken');

//(WORKING SCRIPT (MESSAGE REQUEST MIGHT SHOW FIRST 5 429 ERROR THEN 100 REQUESTS SUCCEEDED) )
// Replace with your actual endpoint you want to test.
const testEndpoint = 'http://localhost:3001/Shielas-response';
// Make sure the payload matches the expected input for your endpoint
const secret = env.secretKey;

const payload = {
    // Include user information and any claims you need here.
    // For example:
    userId: 'user123',
    username: 'johnDoe',
    // etc...
  };

const token = jwt.sign(payload, secret, { expiresIn: '1h' });



const axiosPayload = {
  text: "This is a test message to Sheila." // assuming the history is an array, adjust as needed
};

const makeRequest = async () => {
  try {
    const response = await axios.post(testEndpoint, axiosPayload, {
        headers: {
            Authorization: `${token}`
        }
    });
    console.log('Request succeeded', response.data);
  } catch (error) {
    if (error.response) {
      // Check for token specific error codes such as 401 or 403
      if(error.response.status === 401 || error.response.status === 403) {
        console.log(token)
        console.log('Authentication failed, possible token issue');
      }
      console.log('Request failed with status code:', error.response.status);
      console.log('Response headers:', error.response.headers);
      console.log('Response data:', error.response.data);
    } else if (error.request) {
      console.log('The request was made but no response was received');
    } else {
      console.log('Error setting up the request:', error.message);
    }
  }
};

// Increase the number if you want to test more requests.
const makeRequestsInSequenceWithTimeout = () => {
    for (let i = 0; i < 105; i++) {
      // This creates a closure that captures the value of i for each iteration
      ((index) => {
        setTimeout(async () => {
          console.log(`Making request number: ${index}`);
          await makeRequest();
        }, index * 1000); // This will delay each iteration by 1 second more than the previous one
      })(i);
    }
  };
  
  makeRequestsInSequenceWithTimeout();
  */