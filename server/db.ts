import { drizzle } from "drizzle-orm/d1";

let _db: ReturnType<typeof drizzle> | null = null;

// Get DB instance from environment (Cloudflare D1)
export function getDb() {
  // In Cloudflare Pages Functions, DB is injected via env
  // For local development, this will be null
  return _db;
}

// Initialize DB with D1 binding (called from Pages Functions)
export function initDb(d1: any) {
  if (!_db && d1) {
    _db = drizzle(d1);
  }
  return _db;
}
