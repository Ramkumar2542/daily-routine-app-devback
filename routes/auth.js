const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

// POST /api/auth/register
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Password min 6 chars"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    try {
      // check duplicate
      let user = await User.findOne({ email });
      if (user)
        return res.status(400).json({ message: "Email already in use" });

      // hash
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // save
      user = new User({ email, passwordHash });
      await user.save();

      // create JWT
      const payload = { userId: user._id, email: user.email };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      });

      return res
        .status(201)
        .json({ token, user: { id: user._id, email: user.email } });
    } catch (err) {
      console.error("Register error", err);
      return res.status(500).json({ message: "Server error" });
    }
  }
);
// POST /api/auth/login
router.post('/login', [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').exists().withMessage('Password required')
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  
      const match = await bcrypt.compare(password, user.passwordHash);
      if (!match) return res.status(400).json({ message: 'Invalid credentials' });
  
      const payload = { userId: user._id, email: user.email };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
  
      return res.json({ token, user: { id: user._id, email: user.email } });
    } catch (err) {
      console.error('Login error', err);
      return res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;
