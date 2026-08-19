const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'hourlee_super_secret_jwt_key_2026_jitter_design', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide username, email, and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.trim() }]
    });

    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        return res.status(400).json({ success: false, message: 'Email is already registered' });
      }
      return res.status(400).json({ success: false, message: 'Username is already taken' });
    }

    const user = await User.create({
      username: username.trim(),
      email: email.toLowerCase(),
      passwordHash: password
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        suggestions: user.suggestions,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { login: identifier, username, email, password } = req.body;
    const userIdentifier = identifier || username || email;

    if (!userIdentifier || !password) {
      return res.status(400).json({ success: false, message: 'Please provide username/email and password' });
    }

    const user = await User.findOne({
      $or: [
        { email: userIdentifier.toLowerCase().trim() },
        { username: userIdentifier.trim() }
      ]
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        suggestions: user.suggestions,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      user: {
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        suggestions: req.user.suggestions || ['Talking', 'Coding', 'Studying DSA', 'Gym Workout', 'Lunch', 'YouTube', 'Free Time'],
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a task suggestion
// @route   POST /api/auth/suggestions
// @access  Private
const addSuggestion = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Suggestion text is required' });
    }

    const cleaned = text.trim();
    const user = await User.findById(req.user._id);

    if (!user.suggestions.includes(cleaned)) {
      user.suggestions.push(cleaned);
      await user.save();
    }

    res.json({
      success: true,
      suggestions: user.suggestions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove a task suggestion
// @route   DELETE /api/auth/suggestions
// @access  Private
const removeSuggestion = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, message: 'Suggestion text is required' });
    }

    const user = await User.findById(req.user._id);
    user.suggestions = user.suggestions.filter((s) => s !== text);
    await user.save();

    res.json({
      success: true,
      suggestions: user.suggestions
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  getMe,
  addSuggestion,
  removeSuggestion
};
