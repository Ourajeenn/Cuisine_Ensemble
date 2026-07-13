import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

console.log(`[INFO] Starting server on port ${PORT}`);
console.log(`[INFO] NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`[INFO] __dirname: ${__dirname}`);

// Health check
app.get('/health', (req, res) => {
  console.log('[INFO] Health check requested');
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Metrics
app.get('/metrics', (req, res) => {
  console.log('[INFO] Metrics requested');
  res.set('Content-Type', 'text/plain');
  res.send(`# HELP app_health Application health\n# TYPE app_health gauge\napp_health 1\n`);
});

// Serve static files from dist
const distPath = path.join(__dirname, '../dist');
console.log(`[INFO] Checking dist path: ${distPath}`);
console.log(`[INFO] Dist path exists: ${fs.existsSync(distPath)}`);

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  console.log(`[INFO] Serving static files from ${distPath}`);
} else {
  console.warn(`[WARN] Dist directory not found at ${distPath}`);
}

// Simple HTML fallback
const htmlFallback = `
<!DOCTYPE html>
<html>
<head>
  <title>CuisineEnsemble</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f5f5f5; }
    .container { text-align: center; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    h1 { color: #333; margin: 0 0 10px; }
    p { color: #666; margin: 5px 0; }
    .status { color: #4CAF50; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🍽️ CuisineEnsemble</h1>
    <p>Meal Sharing Platform</p>
    <p class="status">✓ Server is running on port ${PORT}</p>
    <p style="color: #999; font-size: 12px; margin-top: 20px;">
      Build assets loading... If blank, dist folder may not be built yet.
    </p>
  </div>
</body>
</html>
`;

// SPA fallback - serve index.html if exists, otherwise fallback HTML
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '../dist/index.html');
  
  if (fs.existsSync(indexPath)) {
    console.log(`[INFO] Serving index.html for ${req.path}`);
    res.sendFile(indexPath);
  } else {
    console.log(`[WARN] index.html not found, serving fallback HTML for ${req.path}`);
    res.type('html').send(htmlFallback);
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.stack}`);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[SUCCESS] Server listening on 0.0.0.0:${PORT}`);
  console.log(`[SUCCESS] Health: http://localhost:${PORT}/health`);
  console.log(`[SUCCESS] Metrics: http://localhost:${PORT}/metrics`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[INFO] SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('[SUCCESS] Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('[INFO] SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('[SUCCESS] Server closed');
    process.exit(0);
  });
});

process.on('uncaughtException', (err) => {
  console.error(`[FATAL] Uncaught Exception: ${err.message}`);
  console.error(err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(`[FATAL] Unhandled Rejection at: ${promise}, reason: ${reason}`);
  process.exit(1);
});
