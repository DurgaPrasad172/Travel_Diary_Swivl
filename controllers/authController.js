//contollers/authContoller.js

const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtUtils = require('../config/jwtUtils');

const authController = {
  register: async (req, res) => {
    try {
      // Extract username, email, and password from request body
      const { username, email, password } = req.body;

      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      user = new User({
        username,
        email,
        password: hashedPassword
      });

      // Save user to the database
      await user.save();
      const token = jwtUtils.generateToken(user);
    res.status(201).json({ token });

      res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
    }
  },

  login: async (req, res) => {
    try {
      // Extract email and password from request body
      const { email, password } = req.body;

      // Check if user exists
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Create and send JWT token
      const payload = {
        user: {
          id: user._id
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1h' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
    }
  },
  
  getProfile: async (req, res) => {
    try {
      // Retrieve user profile from database
      const user = await User.findById(req.user.id).select('-password');
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
    }
  },
  
  updateProfile: async (req, res) => {
    try {
      // Extract updated profile data from request body
      const { username, email } = req.body;

      // Fetch user from database
      let user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Update user profile
      user.username = username || user.username;
      user.email = email || user.email;

      // Save updated user profile to the database
      await user.save();

      res.json({ message: 'Profile updated successfully', user });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
    }
  },
  deleteProfile: async (req, res) => {
    try {
      // Delete user profile from database
      await User.findByIdAndDelete(req.user.id);
      
      res.json({ message: 'Profile deleted successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
    }
  }
  
  // Other authentication methods like profile management can be implemented here
};

module.exports = authController;
