const express = require('express');
const path = require('path');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const productsRoutes = require('./routes/products.routes');
const adminRoutes = require('./routes/admin');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Moji backend is running',
    timestamp: new Date().toISOString(),
  });
});

// Public API
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);

// Admin API (all routes below require admin JWT)
app.use('/api/admin', adminRoutes);

if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../../client/dist');
  app.use(express.static(distPath));
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Moji backend — ShopSmart');
  });
}

app.use(errorHandler);

module.exports = app;
