const express = require('express');
const router = express.Router();

const apiCallsController = require('../controllers/apiCallsController');

router.post('/Shielas-response', apiCallsController.getOpenAIResponse)

module.exports = router