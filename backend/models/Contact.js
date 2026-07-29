const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    maxlength: 254,
  },
  message: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 5000,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    // The admin dashboard always sorts by newest first.
    index: true,
  },
});

module.exports = mongoose.model('Contact', ContactSchema);
