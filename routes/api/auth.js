const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const router = express.Router();

// @route:   GET api/auth
// @desc:    Test route
// @access:  Public
// router.get('/', (req, res) => res.send('Auth Route'));

// @route:   GET api/auth
// @desc:    Get user data
// @access:  Private
router.get('/', auth, async (req, res) => {
  //Try and get user info from  DB
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    //Send user info to the front end
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route:   POST api/auth
// @desc:    Log in and authenticat user
// @access:  Private
router.post(
  '/',
  [
    check('email', 'Please include a valid email'),
    check('password', 'Password Required'),
  ],
  async (req, res) => {
    //Check for validation errors
    const errors = validationResult(req);
    //If errors return
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      //Checking if user exists
      if (!user) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      //Check if passwords match
      const isMatch = await bcrypt.compare(password, user.password);
      
      //If passwords dont match return
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      //Create a jwt payload
      const payload = {
        user: {
          id: user._id,
        },
      };

      //sign and send jwt in response
      jwt.sign(
        payload,
        process.env.jwtSecret,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;