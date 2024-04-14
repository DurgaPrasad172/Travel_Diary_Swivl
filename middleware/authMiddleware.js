
//middleware/authMiddleware.js
require('dotenv').config();
const jwtUtils = require('../config/jwtUtils');

const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  // Extract token from request headers
  let jwtToken;
  const token = req.headers["authorization"];
  //console.log(token);

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  if(token!==undefined){
    jwtToken=token.split(" ")[1];
  }

  let decodedToken;
  try {
    // Verify token
    decodedToken= jwtUtils.verifyToken(jwtToken, process.env.JWT_SECRET);

    // Fetch user from database based on decoded token
    const user = await User.findById(decodedToken.user.id);
    console.log(user);

    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    // Attach user object to request for further use
    req.user=user;
   
    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Authentication Server Error' });
  }
};

module.exports = authMiddleware;
