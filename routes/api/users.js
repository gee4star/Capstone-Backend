const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const router = express.Router();

// @route:   GET api/users
// @desc:    Test route
// @access:  Public
router.get('/', (req, res) => res.send('User Route'));

// @route:   POST api/users
// @desc:    SignUp/Create User
// @access:  Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    //Check our validation
    const errors = validationResult(req);

    //Check if any validation errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //Destructure components from req
    const { name, email, password } = req.body;

    try {
      //Check if user already exists
      let user = await User.findOne({ email });

      //if user exists respond with error
      if (user) {
        return res
          .status(400)
          .json({ error: [{ msg: 'User Already Exists' }] });
      }

      //Create a user
      user = new User({
        name,
        email,
        password,
      });

      //Encrypt users password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      //Create payload to keep user signed in

      const payload = {
        user: {
          id: user._id,
        },
      };
      //Create and sign jwt
      jwt.sign(
        payload,
        process.env.jwtSecret,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({ token });
        }
      );
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;