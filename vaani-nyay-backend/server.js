const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();

// MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vaani-nyay';

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

/* ----------------------------- User Schema ----------------------------- */
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isActive: { type: Boolean, default: true },
  lastLogin: Date
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAuthToken = function () {
  return jwt.sign({
    userId: this._id,
    email: this.email,
    name: this.name,
    role: this.role
  }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
};

const User = mongoose.model('User', userSchema);

/* ----------------------------- Case Schema ----------------------------- */
const caseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  caseId: { type: String, required: true, unique: true },
  status: { type: String, enum: ['Pending', 'Under Review', 'Documentation Required', 'Approved', 'Closed', 'Rejected'], default: 'Pending' },
  progress: { type: Number, default: 0 },
  nextHearingDate: Date,
  createdAt: { type: Date, default: Date.now },
  applicationType: { type: String, default: 'General' }
}, { timestamps: true });

const Case = mongoose.model('Case', caseSchema);

/* ----------------------------- Routes ----------------------------- */

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Vaani-Nyay Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;
    
    if (!name || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }
    
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email or phone already exists' });
    }

    const user = new User({ name, email, phone, password });
    await user.save();

    // JWT expires in 2 hours
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      { expiresIn: '2h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: validationErrors[0] || 'Validation failed' });
    }
    res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    user.lastLogin = new Date();
    await user.save();

    // JWT expires in 2 hours
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      { expiresIn: '2h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
});

/* ---------------------- TRACK CASE API ENDPOINTS ---------------------- */

// Create a new case
app.post('/api/cases', async (req, res) => {
  try {
    const { title, applicationType } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    // Generate unique caseId
    const caseId = Math.random().toString(36).substr(2, 9).toUpperCase();

    const newCase = new Case({
      title,
      caseId,
      applicationType: applicationType || 'General'
    });

    await newCase.save();

    res.status(201).json({
      message: 'Case created successfully',
      case: newCase
    });
  } catch (error) {
    console.error('Create case error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all cases with optional search
app.get('/api/cases', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { caseId: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const cases = await Case.find(query).sort({ createdAt: -1 });
    res.json({ cases });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a single case by ID
app.get('/api/cases/:id', async (req, res) => {
  try {
    const caseItem = await Case.findById(req.params.id);
    if (!caseItem) return res.status(404).json({ error: 'Case not found' });
    res.json({ case: caseItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a case by ID
app.put('/api/cases/:id', async (req, res) => {
  try {
    const updatedCase = await Case.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCase) return res.status(404).json({ error: 'Case not found' });
    res.json({ message: 'Case updated successfully', case: updatedCase });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a case by ID
app.delete('/api/cases/:id', async (req, res) => {
  try {
    const deletedCase = await Case.findByIdAndDelete(req.params.id);
    if (!deletedCase) return res.status(404).json({ error: 'Case not found' });
    res.json({ message: 'Case deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

/* ----------------------------- Fallbacks ----------------------------- */
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Vaani-Nyay Backend Server running on port ${PORT}`);
});