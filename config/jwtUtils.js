require('dotenv').config();
const jwt = require('jsonwebtoken');

const jwtUtils = {
  generateToken: function(user) {
    const payload = {
      user: {
        id: user._id
      }
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '10h' }
    );

    return token;
  },

  verifyToken: function(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (err) {
      console.error(err.message);
      throw err;
    }
  }
};

module.exports = jwtUtils;

