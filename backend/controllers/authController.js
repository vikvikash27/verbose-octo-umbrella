const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');
const User = require('../models/User');
require('dotenv').config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user (customer)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please add all fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with that email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: 'customer',
      avatar: `https://i.pravatar.cc/150?u=${email}`,
    });

    if (user) {
      res.status(201).json({
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(`Error in registerUser: ${error.message}`);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

// @desc    Authenticate a user (customer)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, role: 'customer' });

    if (user && (await user.matchPassword(password))) {
      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials for a customer account' });
    }
  } catch (error) {
    console.error(`Error in loginUser: ${error.message}`);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

// @desc    Authenticate an admin
// @route   POST /api/auth/admin/login
// @access  Public
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, role: 'admin' });

    if (user && (await user.matchPassword(password))) {
      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials or not an admin' });
    }
  } catch (error) {
    console.error(`Error in adminLogin: ${error.message}`);
    res.status(500).json({ message: 'Server error during admin login.' });
  }
};


// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    // req.user is populated by the 'protect' middleware
    res.status(200).json(req.user);
  } catch (error) {
    console.error(`Error in getMe: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Verify Firebase ID token and log in or register user
// @route   POST /api/auth/verify-firebase-token
// @access  Public
const verifyFirebaseToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: 'Firebase token is required.' });
    }

    // Verify the ID token using the Firebase Admin SDK.
    const decodedToken = await admin.auth().verifyIdToken(token);
    const phone = decodedToken.phone_number.replace('+91', ''); // Standardize phone number

    // Find or create a user in our MongoDB.
    let user = await User.findOne({ phone });
    
    if (!user) {
      user = await User.create({
        phone,
        name: `User ${phone.slice(-4)}`,
        // Create a unique placeholder email based on the phone number
        email: `${phone}@easyorganic.app`, 
        // Create a random password since login is handled by OTP
        password: Math.random().toString(36).substring(2), 
        role: 'customer',
        avatar: `https://i.pravatar.cc/150?u=${phone}`,
      });
    }

    // Respond with our application user details and our own JWT token.
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role,
      token: generateToken(user._id), // Our app's session token
    });

  } catch (error) {
    console.error('Firebase token verification error:', error);
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ message: 'Login session expired, please try again.' });
    }
    if (error.code === 11000) { // MongoDB duplicate key error
        return res.status(400).json({ message: 'An account with this phone number already exists.' });
    }
    res.status(500).json({ message: 'Authentication failed. Please try again.' });
  }
};


module.exports = {
  registerUser,
  loginUser,
  adminLogin,
  getMe,
  verifyFirebaseToken,
};