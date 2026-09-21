require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');

const app = express();

// CORS_ORIGIN can be a single URL or a comma-separated list, e.g.:
//   CORS_ORIGIN=https://your-frontend.vercel.app,http://localhost:3000
// If not set, all origins are allowed (fine for testing, tighten for real use).
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : '*';

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.use('/api', authRoutes);

app.get('/', (req, res) => {
  res.send('Facebook clone API is running.');
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});
