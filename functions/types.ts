// Types for Cloudflare Pages Functions

export interface Env {
  // D1 Database binding
  DB: D1Database;
  
  // Environment variables
  JWT_SECRET: string;
  NODE_ENV: string;
  VITE_APP_ID: string;
  VITE_APP_TITLE: string;
  VITE_OAUTH_PORTAL_URL: string;
  VITE_FRONTEND_FORGE_API_URL: string;
  VITE_FRONTEND_FORGE_API_KEY: string;
  OAUTH_SERVER_URL: string;
  OWNER_OPEN_ID: string;
  BUILT_IN_FORGE_API_URL: string;
  BUILT_IN_FORGE_API_KEY: string;
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
