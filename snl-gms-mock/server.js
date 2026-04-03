const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// Serve Cesium assets
app.use('/cesium', express.static(path.join(__dirname, 'node_modules/cesium/Build/Cesium')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API proxy to GMS Simulator (if running)
try {
  const { createProxyMiddleware } = require('http-proxy-middleware');
  app.use('/api', createProxyMiddleware({
    target: process.env.API_URL || 'http://localhost:31595',
    changeOrigin: true,
    pathRewrite: { '^/api': '/api' }
  }));
} catch (e) {
  console.log('http-proxy-middleware not available, skipping API proxy');
}

// SPA fallback - must be last
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, HOST, () => {
  console.log('GMS Mock UI running at http://' + HOST + ':' + PORT + '/');
  console.log('Health check: http://' + HOST + ':' + PORT + '/health');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});
