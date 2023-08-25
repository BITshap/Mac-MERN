const User = require('../models/user');
const jwt = require('jsonwebtoken');
const env = require('../.env');
const bcrypt = require('bcrypt');
const Filter = require('bad-words');

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

const getTopUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ score: -1 }).limit(10);
    res.json(users);
  } catch (error) {
    console.error('Failed to retrieve top users:', error);
    res.status(500).json({ error: 'Failed to retrieve top users' });
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

const getUserPaginationLogs = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page, 10) || 1; // Default is page 1 if not provided
    const limit = parseInt(req.query.limit, 10) || 10; // Default is 15 logs per page if not provided

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User does not exist' });
    }

    const totalLogs = user.logs.length;

    //Reversed Logs
    const reversedLogs = [...user.logs].reverse();
    const reversedTimestamps = [...user.timestamps].reverse();

    // Calculate the indices for slicing
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // Get paginated logs and timestamps
    const logs = reversedLogs.slice(startIndex, endIndex);
    const timestamps = reversedTimestamps.slice(startIndex, endIndex);
    const newScore = user.score;


    // Return the paginated data and some additional pagination info
    return res.json({
      logs,
      timestamps,
      currentPage: page,
      totalPages: Math.ceil(totalLogs / limit),
      totalLogs,
      newScore
    });
  } catch (error) {
    console.error('Failed to retrieve paginated user logs:', error);
    return res.status(500).json({ error: 'Failed to retrieve paginated user logs' });
  }
};


// User login
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    console.log("Fetched user:", user);

    if (user) {
      // Manually hash the incoming password
      const hashedIncomingPassword = await bcrypt.hash(password, 9);
      console.log("Hashed password from database:", user.password);
      console.log("Manually hashed incoming password:", hashedIncomingPassword);

      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (isPasswordValid) {
        const token = jwt.sign({ _id: user._id, score: user.score, username }, secret, { expiresIn: '1h' });
        res.json({ token, _id: user._id, score: user.score });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
        console.log("Invalid username or password");
      }
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
      console.log("User not found");
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const userSignUp = async (req, res) => {
  const {name, email, username, password } = req.body;

  const filter = new Filter();

  if (filter.isProfane(name) || filter.isProfane(username)) {
    return res.status(400).json({ error: "Let's keep it classy! Please use a different name or username.", errorType: 'INAPPROPRIATE_CONTENT' });
  }

  const isValidEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(String(email).toLowerCase());
  };

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {

    const existingName = await User.findOne({ name });
    if (existingName) {
      return res.status(409).json({ error: 'A user with this name already exists', errorType: 'NAME_EXISTS' });
    }
    //Check if username, name combination exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({ error: 'A user with this username already exists', errorType: 'USERNAME_EXISTS' });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ error: 'A user with this email already exists', errorType: 'EMAIL_EXISTS' });
    }

    const user = new User({ name, email, username, password });
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
  getUserPaginationLogs,
  getTopUsers,
  loginUser,
  userSignUp,
  updateUserScore,
};
