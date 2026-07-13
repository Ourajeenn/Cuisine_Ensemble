import http from 'http';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8080;

// Import the server export
const serverModule = await import('./dist/server/server.js');
const server = serverModule.default;

console.log(`[INFO] Starting server on port ${PORT}`);

const httpServer = http.createServer(async (req, res) => {
  try {
    console.log(`[INFO] ${req.method} ${req.url}`);
    
    // Create a Request object
    const url = new URL(req.url, `http://${req.headers.host}`);
    const request = new Request(url, {
      method: req.method,
      headers: req.headers,
      body: ['GET', 'HEAD'].includes(req.method) ? null : req,
    });

    // Call the server fetch handler
    const response = await server.fetch(request);

    // Send response
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(await response.text());
  } catch (error) {
    console.error('[ERROR]', error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
});

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`[SUCCESS] Server listening on 0.0.0.0:${PORT}`);
  console.log(`[SUCCESS] Health: http://localhost:${PORT}/health`);
  console.log(`[SUCCESS] Metrics: http://localhost:${PORT}/metrics`);
});

process.on('SIGTERM', () => {
  console.log('[INFO] SIGTERM received, shutting down');
  httpServer.close(() => {
    console.log('[SUCCESS] Server closed');
    process.exit(0);
  });
});
