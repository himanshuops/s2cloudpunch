require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Contact = require('./models/Contact');

const app = express();
app.use(express.json());

// --- Allowed origins ---
const allowedOrigins = [
  process.env.FRONTEND_URL,     // from .env (changes between local and Render)
  'http://localhost:5500',      // fallback for local
  'http://127.0.0.1:5500',      // fallback
  'http://localhost:3000',      // if testing directly
  'https://h.s2cloudpunch.in',  // deployed frontend
  'https://s2cloudpunch.in'     // root domain (optional)
];

// CORS setup
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed from: ' + origin));
    }
  },
  methods: ['GET', 'POST'],
}));

// --- MongoDB connection ---
const MONGO = process.env.MONGO_URI;
if (!MONGO) {
  console.error('❌ Missing MONGO_URI in .env');
  process.exit(1);
}

mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => { console.error('❌ MongoDB connect error', err); process.exit(1); });

// --- Routes ---
app.get('/api/health', (req, res) => res.json({ ok: true, env: process.env.NODE_ENV || 'dev' }));

app.post('/api/contact', async (req, res) => {
  try {
    const { name, phone, city, email, message } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'name and email required' });

    const doc = await Contact.create({ name, phone, city, email, message });
    return res.json({ ok: true, id: doc._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error' });
  }
});

app.get('/api/contacts', async (req, res) => {
  const list = await Contact.find().sort({ createdAt: -1 }).limit(200);
  res.json(list);
});

// 404 handler
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// --- Start server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));


