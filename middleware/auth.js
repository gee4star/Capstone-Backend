const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  //Get token from header
  const token = req.header('x-auth-token');

  //Check if there is not a token and respond
  if (!token) {
    return res.status(401).json({ msg: 'No token, Auth Denied' });
  }

  //Verify if token is valid
  try {
    const decoded = jwt.verify(token, process.env.jwtSecret);

    req.user = decoded.user;

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};