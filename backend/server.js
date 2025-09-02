require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Contact = require('./models/Contact');

const app = express();
app.use(express.json());

// ------------------ CORS Config ------------------
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5500'; // adjust if needed
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow server-to-server / curl
    if (origin === FRONTEND_URL || origin.includes('localhost')) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  }
}));

// ------------------ MongoDB Connection ------------------
const MONGO = process.env.MONGO_URI;
if (!MONGO) {
  console.error('❌ Missing MONGO_URI in environment. Exiting.');
  process.exit(1);
}
mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => { console.error('❌ MongoDB connect error', err); process.exit(1); });

// ------------------ API Routes ------------------
app.get('/api/health', (req, res) => res.json({ ok: true }));

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

// ------------------ Serve Frontend ------------------
// Serve static files from repo root (where index.html, style.css, script.js exist)
app.use(express.static(path.join(__dirname, '..')));

// Catch-all route: always return index.html for unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// ------------------ Start Server ------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


