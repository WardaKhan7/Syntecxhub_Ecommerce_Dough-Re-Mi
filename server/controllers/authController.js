const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const { sendVerificationEmail } = require('../utils/mailer');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register + Send Verification
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false
    });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      try {
        await sendVerificationEmail(user.email, token);
        res.status(201).json({ 
          message: 'Registration successful! Please check your email for verification link.',
          _id: user._id, 
          email: user.email 
        });
      } catch (mailError) {
        console.error('Nodemailer error:', mailError);
        user.isVerified = true;
        await user.save();
        res.status(201).json({ 
          message: 'Registration successful! Email sending failed, your account is auto-verified.',
          _id: user._id,
          email: user.email
        });
      }
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Verify Email
const verifyEmail = async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).send('User not found');
    }

    if (user.isVerified) {
      return res.send('Email already verified 🎉');
    }

    user.isVerified = true;
    await user.save();

    res.send('Email verified successfully 🎉 You can now log in.');
  } catch (error) {
    console.error('Verify error:', error);
    res.status(400).send('Invalid or expired verification link.');
  }
};

// Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Auto-verify unverified users so they're not locked out
      if (!user.isVerified) {
        user.isVerified = true;
        await user.save();
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Google Login
const googleLogin = async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ message: 'No Google credential received' });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        isVerified: true,
        googleId: sub,
        role: 'user'
      });
    } else {
      // Link Google account and verify if not already
      if (!user.googleId) user.googleId = sub;
      if (!user.isVerified) user.isVerified = true;
      await user.save();
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Google login error details:', error.message);
    res.status(400).json({ message: `Google authentication failed: ${error.message}` });
  }
};

module.exports = { registerUser, verifyEmail, loginUser, googleLogin };
