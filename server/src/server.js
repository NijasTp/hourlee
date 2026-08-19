const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const os = require('os');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/activities', require('./routes/activityRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Hourlee API', timestamp: new Date() });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Hourlee Backend] Server running on port ${PORT}`);

  // Display local network IP addresses for LAN access
  const interfaces = os.networkInterfaces();
  console.log('----------------------------------------------------');
  console.log(`➜ Local:   http://localhost:${PORT}`);
  Object.keys(interfaces).forEach((ifaceName) => {
    interfaces[ifaceName].forEach((iface) => {
      if (iface.family === 'IPv4' && !iface.internal) {
        console.log(`➜ Network: http://${iface.address}:${PORT}`);
      }
    });
  });
  console.log('----------------------------------------------------');
});
