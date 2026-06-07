const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://portfolio-1q1t.onrender.com'],
  methods: ['GET', 'POST', 'DELETE'],
}));
app.use(express.json());

// MongoDB Connection
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch(err => console.error('❌ MongoDB connection error:', err));
} else {
  console.warn('WARNING: MONGO_URI is not defined in .env file.');
}

// Routes
const Contact = require('./models/Contact');

// POST - Submit a contact message
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Please provide name, email, and message' });
    }

    if (!process.env.MONGO_URI) {
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

// GET - Fetch all contact messages (for admin dashboard)
app.get('/api/contact', async (req, res) => {
  try {
    if (!process.env.MONGO_URI) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Server error while fetching messages' });
  }
});

// DELETE - Remove a contact message by ID
app.delete('/api/contact/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Contact.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.status(200).json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Server error while deleting message' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
