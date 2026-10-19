import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

// Connexion à la base de données MongoDB
connectDB();

const server = app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 To-Do List Backend API running on port ${PORT}`);
  console.log(`📡 Healthcheck: http://localhost:${PORT}/api/health`);
  console.log(`📝 Tasks API:   http://localhost:${PORT}/api/tasks`);
  console.log(`🔒 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`===============================================`);
});

// Gestion gracieuse des arrêts (Graceful Shutdown)
const handleExit = (signal) => {
  console.log(`\n[Server] Signal ${signal} reçu. Fermeture gracieuse en cours...`);
  server.close(() => {
    console.log('[Server] Serveur HTTP arrêté proprement.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => handleExit('SIGTERM'));
process.on('SIGINT', () => handleExit('SIGINT'));

// Capture des rejets de promesses non gérés
process.on('unhandledRejection', (err) => {
  console.error('[FATAL] Rejet de promesse non géré :', err);
  server.close(() => process.exit(1));
});
