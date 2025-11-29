// Types for Cloudflare Pages Functions

export interface Env {
  // D1 Database binding
  DB: D1Database;
  
  // Environment variables
  JWT_SECRET: string;
  NODE_ENV: string;
  VITE_APP_ID: string;
  VITE_APP_TITLE: string;
  OWNER_EMAIL: string;
  VITE_GOOGLE_MAPS_API_KEY?: string;
}

export type EventContext<Env = any, P extends string = any, Data = any> = {
  request: Request;
  env: Env;
  params: Record<P, string>;
  data: Data;
  waitUntil: (promise: Promise<any>) => void;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  functionPath: string;
};
