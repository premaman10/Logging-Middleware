const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/logging-middleware';
mongoose.connect(mongoUri)
  .then(() => {
    console.log("MongoDB connected successfully.");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
});

const Url = mongoose.model('Url', urlSchema);

function generateShortId(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

app.post('/api/shorten', asyncHandler(async (req, res) => {
  const { originalUrl } = req.body;
  if (!originalUrl) return res.status(400).json({ status: false, message: 'URL is required' });
  try {
    new URL(originalUrl);
  } catch {
    return res.status(400).json({ status: false, message: 'Invalid URL' });
  }
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
  while (await Url.findOne({ shortId })) {
    shortId = generateShortId();
  }
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
  url = new Url({ originalUrl, shortId, expiresAt });
  await url.save();
  res.json({
    status: true,
    data: {
      longUrl: url.originalUrl,
      shortUrl: `${req.protocol}://${req.get('host')}/${url.shortId}`,
      urlCode: url.shortId
    }
  });
}));

app.get('/:shortId', asyncHandler(async (req, res) => {
  const { shortId } = req.params;
  if (!shortId) return res.status(400).json({ status: false, message: 'Short code is required' });
  const url = await Url.findOne({ shortId });
  if (url) {
    if (new Date() > url.expiresAt) {
      return res.status(410).json({ status: false, message: 'URL has expired' });
    }
    return res.redirect(302, url.originalUrl);
  } else {
    return res.status(404).json({ status: false, message: 'URL not found' });
  }
}));

app.get('/api/urls', asyncHandler(async (req, res) => {
  const urls = await Url.find().sort({ createdAt: -1 });
  res.json({ status: true, data: urls });
}));

app.use((err, req, res, next) => {
  console.error('Error:', err);
  if (err.name === 'ValidationError') {
    return res.status(400).json({ status: false, message: err.message });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ status: false, message: 'Invalid ID format' });
  }
  if (err.code === 11000) {
    return res.status(409).json({ status: false, message: 'Duplicate entry' });
  }
  res.status(500).json({ status: false, message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 