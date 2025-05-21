const express = require('express');
const router = express.Router();
const { getBotResponse } = require('../controllers/chatbotController');

router.post('/chat', getBotResponse);

module.exports = router;
