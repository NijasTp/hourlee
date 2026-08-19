const express = require('express');
const router = express.Router();
const { signup, login, getMe, addSuggestion, removeSuggestion } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);

router.post('/suggestions', protect, addSuggestion);
router.delete('/suggestions', protect, removeSuggestion);

module.exports = router;
