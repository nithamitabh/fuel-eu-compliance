// backend/src/index.ts
import 'dotenv/config';
import { App } from './infrastructure/server/app';

const PORT = process.env.PORT || 3000;

// Initialize the application
const application = new App();

// Start the server
const server = application.app.listen(PORT, () => {
  console.log(`🚀 FuelEU Maritime Compliance API`);
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(async () => {
    await application.disconnect();
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(async () => {
    await application.disconnect();
    console.log('HTTP server closed');
    process.exit(0);
  });
});