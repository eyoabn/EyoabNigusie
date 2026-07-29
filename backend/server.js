const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;
const IS_PROD = process.env.NODE_ENV === 'production';

// Render/Heroku sit behind a proxy — without this every request looks like it
// comes from the same IP, so rate limiting would throttle all visitors at once.
app.set('trust proxy', 1);

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

app.use(helmet());

// Allowed origins come from the environment so a redeploy doesn't need a code change.
// ALLOWED_ORIGINS=https://your-site.com,https://www.your-site.com
const DEFAULT_ORIGINS = ['http://localhost:5173', 'http://localhost:4173', 'http://localhost:3000'];
const configuredOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const originList = configuredOrigins.length ? configuredOrigins : DEFAULT_ORIGINS;

if (!configuredOrigins.length && IS_PROD) {
  console.warn('⚠️  ALLOWED_ORIGINS is not set — falling back to localhost only. Production requests will be blocked.');
}

app.use(
  cors({
    origin(origin, callback) {
      // No Origin header = same-origin, curl, or a health check. Allow those.
      if (!origin) return callback(null, true);
      if (originList.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS: origin ${origin} is not allowed`));
    },
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'x-admin-password'],
  })
);

// Cap the body size — a contact message never needs more than a few KB.
app.use(express.json({ limit: '10kb' }));

// ---------------------------------------------------------------------------
// Rate limiting
// ---------------------------------------------------------------------------

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 submissions per IP per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many messages sent from this address. Please try again later.' },
});

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // slows password guessing to a crawl
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Please try again later.' },
});

// ---------------------------------------------------------------------------
// Database
// ---------------------------------------------------------------------------

if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));
} else {
  console.warn('WARNING: MONGO_URI is not defined in .env file.');
}

const Contact = require('./models/Contact');

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

/**
 * Compares two strings in constant time so response timing can't be used to
 * recover the password one character at a time. Both sides are hashed first
 * because timingSafeEqual throws when the buffers differ in length.
 */
function safeEqual(a, b) {
  const hashA = crypto.createHash('sha256').update(String(a)).digest();
  const hashB = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

/**
 * Fails CLOSED: when ADMIN_PASSWORD is missing the admin endpoints are disabled
 * rather than left publicly readable.
 */
const adminAuth = (req, res, next) => {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error('ADMIN_PASSWORD is not set — admin endpoints are disabled.');
    return res.status(503).json({ error: 'Admin access is not configured on this server.' });
  }

  const clientPassword = req.headers['x-admin-password'];
  if (!clientPassword || !safeEqual(clientPassword, adminPassword)) {
    return res.status(401).json({ error: 'Unauthorized: Invalid admin password.' });
  }

  next();
};

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 254 },
  message: { min: 10, max: 5000 },
};

function validateContact(body) {
  const errors = [];
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (name.length < LIMITS.name.min || name.length > LIMITS.name.max) {
    errors.push(`Name must be between ${LIMITS.name.min} and ${LIMITS.name.max} characters.`);
  }
  if (!EMAIL_RE.test(email) || email.length > LIMITS.email.max) {
    errors.push('Please provide a valid email address.');
  }
  if (message.length < LIMITS.message.min || message.length > LIMITS.message.max) {
    errors.push(`Message must be between ${LIMITS.message.min} and ${LIMITS.message.max} characters.`);
  }

  return { errors, value: { name, email, message } };
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Portfolio Backend API is running successfully!' });
});

// POST - Submit a contact message
app.post('/api/contact', contactLimiter, async (req, res) => {
  try {
    // Honeypot: a hidden field real users never fill in, but bots do.
    // Reply 201 so the bot thinks it succeeded and doesn't retry.
    if (req.body.website) {
      console.log('Honeypot triggered — submission discarded.');
      return res.status(201).json({ success: true, message: 'Message sent successfully' });
    }

    const { errors, value } = validateContact(req.body);
    if (errors.length) {
      return res.status(400).json({ error: errors.join(' ') });
    }

    const { name, email, message } = value;

    if (process.env.MONGO_URI) {
      await new Contact({ name, email, message }).save();
    } else {
      console.log('Received contact submission (No DB connected):', { name, email });
    }

    // Email is best-effort: the message is already stored, so a mail failure
    // must not turn into a failed request for the visitor.
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER,
          replyTo: email,
          subject: `New Portfolio Contact from ${name}`,
          text: `You have a new message from your portfolio website!\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`,
        });
        console.log('Email notification sent successfully');
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError.message);
      }
    }

    res.status(201).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ error: 'Server error while saving message' });
  }
});

// GET - Fetch all contact messages (admin dashboard)
app.get('/api/contact', adminLimiter, adminAuth, async (req, res) => {
  try {
    if (!process.env.MONGO_URI) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    const messages = await Contact.find().sort({ createdAt: -1 }).limit(500);
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Server error while fetching messages' });
  }
});

// DELETE - Remove a contact message by ID
app.delete('/api/contact/:id', adminLimiter, adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Reject malformed ids before they reach the driver.
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid message id' });
    }

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

// Unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Central error handler — keeps stack traces out of responses.
app.use((err, req, res, next) => {
  if (err && typeof err.message === 'string' && err.message.startsWith('CORS:')) {
    return res.status(403).json({ error: 'Origin not allowed' });
  }
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
