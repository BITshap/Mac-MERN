const express = require("express");
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const app = express();
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');

const userController = require('./controllers/userController');
const apiCallsController = require('./controllers/apiCallsController')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const URL = process.env.MONGO_URL;
const secret = process.env.SECRET_KEY;
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

const corsOptions = {
    origin: 'https://journalme.io', // This should be the domain of your frontend application
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(express.static("public"));
app.use(cors(corsOptions));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);

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

//API Base Route
app.get("/", (req, res) => {
  res.status(200).send("Welcome to the JournalMe API! We're online.");
});

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


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
