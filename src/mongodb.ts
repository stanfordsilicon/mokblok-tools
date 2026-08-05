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
 * The one database every SILICON app shares (users, accounts, sessions,
 * verification_tokens, plus this app's local databases).
 * Overridable per-deploy for a staging copy, but the default is the whole
 * point: one identity across projects.
 *
 * Deliberately identical to idli-main's lib/mongodb.ts — the two apps must
 * resolve to the SAME database name, or Auth.js creates a second users row
 * for the same person. Legacy note: this app used to hard-code "homescreen";
 * migrate-users.mjs at the repo root merged that database into "silicon".
 */
export function siliconDbName(): string {
  return process.env.SILICON_DB_NAME ?? 'silicon';
}
