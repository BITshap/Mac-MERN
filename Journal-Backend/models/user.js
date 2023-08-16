const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  last_name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true},
  score: { type: Number, default: 0 },
  timestamps: [Date],
  logs: [String]
});

const User = mongoose.model('User', userSchema);

module.exports = User;