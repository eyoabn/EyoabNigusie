const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI, {})
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.warn('WARNING: MONGO_URI is not defined in .env file. Database connection skipped.');
}

// Routes
const Contact = require('./models/Contact');

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Simple validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Please provide name, email, and message' });
    }

    if (!process.env.MONGO_URI) {
      // If no DB configured yet, just simulate success for testing the frontend
      console.log('Received contact submission (No DB connected):', { name, email, message });
      return res.status(201).json({ success: true, message: 'Message received (DB not configured)' });
    }

    const newContact = new Contact({ name, email, message });
    await newContact.save();

    res.status(201).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ error: 'Server error while saving message' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
