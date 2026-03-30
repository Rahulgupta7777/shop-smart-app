const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/products');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'ShopSmart Backend is running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
  res.send('ShopSmart Backend Service');
});

// Error handling
app.use(errorHandler);

module.exports = app;
