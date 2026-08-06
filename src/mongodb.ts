import { MongoClient } from 'mongodb';

// Cache the client promise on globalThis so dev hot-reloads reuse one
// connection pool instead of opening a new one per reload.
const g = globalThis as typeof globalThis & { _mongoClientPromise?: Promise<MongoClient> };

// connect on first use, not at import time (imports shouldn't throw).
export default function getMongoClient(): Promise<MongoClient> {
  if (!g._mongoClientPromise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('Missing MONGODB_URI in .env.local');
    g._mongoClientPromise = new MongoClient(uri).connect();
  }
  return g._mongoClientPromise;
}

/**
 * Shared database name for auth collections and this app's own data.
 */
export function siliconDbName(): string {
  return process.env.SILICON_DB_NAME ?? 'silicon';
}
