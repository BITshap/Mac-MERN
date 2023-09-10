const express = require("express");
const cors = require('cors');
const app = express();
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const env = require('./.env');

const userController = require('./controllers/userController');
const apiCallsController = require('./controllers/apiCallsController')

const URL = env.mongoURL;
const secret = env.secretKey;
//const APIKEY = env.openAiKey;

// Basic connection
mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB', error);
  });

app.use(express.static("public"));
app.use(cors());
app.use(express.json());

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, secret, (error, decoded) => {
      if (error) {
        return res.status(401).json({ error: 'Invalid token' });
      } else {
        // Token is valid, attach the decoded payload to the request object
        req.user = decoded;
        next();
      }
    });
  } else {
    return res.status(401).json({ error: 'No token provided' });
  }
};

// Users Routes
app.get("/users", verifyToken, userController.getUsers);
app.get("/top-users", userController.getTopUsers);
app.get("/users/:userId/logs", verifyToken, userController.getUserLogs);
app.get("/users/:userId/paged-logs", verifyToken, userController.getUserPaginationLogs);
app.post("/login", userController.loginUser);
app.post("/signup", userController.userSignUp);


app.post('/Shielas-response', verifyToken, async (req, res) => {
  try {
    const { text, history } = req.body;
    console.log('Received text:', text);

    // Call the OpenAI API using your utility function
    const responseText = await apiCallsController.getOpenAIResponse(text, history);

    console.log('Final response:', responseText);

    // Send the response back to the client
    res.json({ responseText });
  } catch (error) {
    console.error('Error processing the request:', error);

    if (error.message.includes('503')) {
      // If it's a 503 error, you can send a more specific message to the frontend.
      return res.status(503).json({ error: "Looks like Sheila's being a little picky, try sending another message!" });
    }

    res.status(500).json({ error: 'Uh oh! The cosmos seems to be out of orbit. Try resending or restarting the app.' });
  }
});

app.put("/users/:userId", verifyToken, userController.updateUserScore);


app.listen(3001, () => {
  console.log("Server started on port 3001");
});
