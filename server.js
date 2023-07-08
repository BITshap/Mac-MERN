const express = require("express");
const cors = require('cors');
const app = express();
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const env = require('/Users/nick-shapoff/Documents/Practice-Projects/Mac-MERN/.env')

const secret = env.secretKey;

//basic connection
mongoose.connect("mongodb://localhost:27017/JournalMe", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(()=>{
  console.log("MongoDB connected");
})
.catch((error)=>{
  console.error('Failed to connect to MongoDB', error);
});

app.use(express.static("public"));
app.use(cors());
app.use(express.json());

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  console.log('Authorization header:', token);

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

app.get("/users", verifyToken, async (req, res) => {
  try {
    const db = mongoose.connection;
    const collection = db.collection('users'); // Use your collection name here

    // Find all documents in the collection
    const documents = await collection.find().toArray();

    // Send the retrieved documents as JSON response
    res.json(documents);
  } catch (error) {
    console.error('Failed to retrieve documents from the database:', error);
    res.status(500).json({ error: 'Failed to retrieve documents from the database' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const db = mongoose.connection;
    const collection = db.collection('users');
    // Find a user with the provided username and password
    const user = await collection.findOne({ username, password });

    if (user) {
      // Generate a web token
      const token = jwt.sign({ username }, secret, { expiresIn: '1h' });

      // Return the token as a response
      res.json({ token });
    } else {
      // Return an error response for failed login attempts
      res.status(401).json({ error: 'Invalid credentials' });
      console.log("Put in a Valid Username or Password")
    }
  } catch (error) {
    // Handle any database errors
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/users/:username', verifyToken, async (req, res) => {
  const { username } = req.params;
  const { score } = req.body;

  try {
    const db = mongoose.connection;
    const collection = db.collection('users');

    // Update the user's score based on the username
    await collection.updateOne({ username }, { $set: { score } });

    res.status(200).json({ message: 'User score updated successfully' });
  } catch (error) {
    console.error('Error updating user score:', error);
    res.status(500).json({ error: 'Error updating user score' });
  }
});


app.listen(3001, () => {
  console.log("Server started on port 3001");
});