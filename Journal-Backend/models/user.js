const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const SALT_ROUNDS = 9;

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true},
  score: { type: Number, default: 0 },
  timestamps: [Date],
  logs: [String],
  termsAccepted: {
    accepted: {
      type: Boolean,
      default: false 
    },
    date: {
      type: Date
    }
  }
});

userSchema.pre('save', function(next) {
  const user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_ROUNDS, (err, salt) => {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, (err, hash) => {
          if (err) return next(err);
          user.password = hash;
          next();
      });
  });
});

const User = mongoose.model('User', userSchema);

module.exports = User; 