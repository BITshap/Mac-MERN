const User = require('../models/user');
const jwt = require('jsonwebtoken');
const env = require('../.env');

const secret = env.secretKey;

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error('Failed to retrieve users:', error);
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
};

// Get user logs by userId
const getUserLogs = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Received userId:', userId);

    const user = await User.findById(userId);
    console.log('User:', user);

    if (!user) {
      console.log('User does not exist');
      return res.status(404).json({ error: 'User does not exist' });
    } else {
      const logs = user.logs;
      const timestamps = user.timestamps;
      const newScore = user.score;
      return res.json({ logs, timestamps, newScore });
    }
  } catch (error) {
    console.error('Failed to retrieve user logs:', error);
    return res.status(500).json({ error: 'Failed to retrieve user logs' });
  }
};

// User login
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });

    if (user) {
      const token = jwt.sign({ _id: user._id, score: user.score, username }, secret, { expiresIn: '1h' });
      res.json({ token, _id: user._id, score: user.score });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
      console.log("Put in a valid username or password");
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const userSignUp = async (req, res) => {
  const {name, last_name, email, username, password } = req.body;

  try {
    //Check if username, name + lastname combination exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({ error: 'A user with this name and last name already exists' });
    }

    const user = new User({ name, last_name, email, username, password });
    await user.save();

    console.log("Nice, " + name + " joined JournalMe!")
    res.status(201).json({ message: 'User created successfully. Please login.' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Update user score
const updateUserScore = async (req, res) => {
  const { userId } = req.params;
  const { score, text, timestamp } = req.body;
  console.log('User Id:', userId)
  console.log('Score:', score)
  console.log('Entry:', text);
  console.log('Timestamp:', timestamp)
  try {
    const updateQuery = {};

    if (text && text !== '') {
      updateQuery.$set = {
        score: score,
      };

      updateQuery.$push = {
        logs: text,
        timestamps: timestamp,
      };
    } else {
      updateQuery.$set = {
        score: score - 1,
      };
    }

    await User.updateOne(
      { _id: userId },
      updateQuery
    );

    res.status(200).json({ message: 'User score updated successfully' });
  } catch (error) {
    console.error('Error updating user score:', error);
    res.status(500).json({ error: 'Error updating user score' });
  }
};

module.exports = {
  getUsers,
  getUserLogs,
  loginUser,
  userSignUp,
  updateUserScore,
};
