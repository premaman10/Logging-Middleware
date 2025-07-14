const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/logging-middleware';
mongoose.connect(mongoUri);

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

const Url = mongoose.model('Url', urlSchema);

// Helper to generate short ID
function generateShortId(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// API to shorten URL
app.post('/api/shorten', async (req, res) => {
  const { originalUrl } = req.body;
  if (!originalUrl) return res.status(400).json({ status: false, message: 'URL is required' });
  // Validate URL
  try {
    new URL(originalUrl);
  } catch {
    return res.status(400).json({ status: false, message: 'Invalid URL' });
  }
  // Check for existing URL
  let url = await Url.findOne({ originalUrl });
  if (url) {
    return res.json({
      status: true,
      data: {
        longUrl: url.originalUrl,
        shortUrl: `${req.protocol}://${req.get('host')}/${url.shortId}`,
        urlCode: url.shortId
      }
    });
  }
  let shortId = generateShortId();
  // Ensure unique shortId
  while (await Url.findOne({ shortId })) {
    shortId = generateShortId();
  }
  url = new Url({ originalUrl, shortId });
  await url.save();
  res.json({
    status: true,
    data: {
      longUrl: url.originalUrl,
      shortUrl: `${req.protocol}://${req.get('host')}/${url.shortId}`,
      urlCode: url.shortId
    }
  });
});

// Redirect short URL to original
app.get('/:shortId', async (req, res) => {
  const { shortId } = req.params;
  if (!shortId) return res.status(400).json({ status: false, message: 'Short code is required' });
  const url = await Url.findOne({ shortId });
  if (url) {
    return res.redirect(302, url.originalUrl);
  } else {
    return res.status(404).json({ status: false, message: 'URL not found' });
  }
});

// Get all shortened URLs
app.get('/api/urls', async (req, res) => {
  const urls = await Url.find().sort({ createdAt: -1 });
  res.json({ status: true, data: urls });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: false, message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 