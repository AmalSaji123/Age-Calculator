import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import invoiceRouter from './routes/invoices.js';

// Optional in-memory MongoDB for development/testing
let MongoMemoryServer;
try {
  // Dynamically require to avoid hard dependency at runtime if not installed
  ({ MongoMemoryServer } = await import('mongodb-memory-server'));
} catch {}

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const useMemDb = String(process.env.USE_MEM_DB || 'false') === 'true';

app.use(cors({ origin: clientOrigin }));
app.use(express.json({ limit: '5mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/invoices', invoiceRouter);

async function connectToDatabase() {
  const mongoUri = process.env.MONGO_URI;

  if (useMemDb) {
    if (!MongoMemoryServer) throw new Error('mongodb-memory-server not installed');
    const mem = await MongoMemoryServer.create();
    const uri = mem.getUri();
    console.log('[DB] Using in-memory MongoDB at', uri);
    await mongoose.connect(uri);
    return;
  }

  if (!mongoUri) {
    console.warn('[DB] MONGO_URI not provided. Falling back to in-memory database if available.');
    if (!MongoMemoryServer) throw new Error('mongodb-memory-server not installed and no MONGO_URI provided');
    const mem = await MongoMemoryServer.create();
    const uri = mem.getUri();
    console.log('[DB] Using in-memory MongoDB at', uri);
    await mongoose.connect(uri);
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('[DB] Connected to MongoDB');
  } catch (err) {
    console.error('[DB] Failed to connect to MongoDB at', mongoUri, err?.message || err);
    if (MongoMemoryServer) {
      console.log('[DB] Falling back to in-memory MongoDB');
      const mem = await MongoMemoryServer.create();
      const uri = mem.getUri();
      console.log('[DB] Using in-memory MongoDB at', uri);
      await mongoose.connect(uri);
    } else {
      throw err;
    }
  }
}

connectToDatabase()
  .then(() => {
    app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
  })
  .catch((err) => {
    console.error('Fatal: cannot start server due to DB connection failure', err);
    process.exit(1);
  });