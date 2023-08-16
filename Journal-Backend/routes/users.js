const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

// Get all users
router.get('/', userController.getUsers);
// Get user logs by userId
router.get('/:userId/logs', userController.getUserLogs);
// Login route
router.post('/login', userController.loginUser);
//SignUp route 
router.post('/signUp', userController.userSignUp);
// Update user score
router.put('/:userId', userController.updateUserScore);

module.exports = router;
