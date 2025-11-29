import type { drizzle } from "drizzle-orm/d1";

// Tipo unificado de contexto que funciona tanto no Express quanto no Pages Functions
export type UnifiedContext = {
  user: { userId: number; email: string; role: string; sector: string } | null;
  db: ReturnType<typeof drizzle>;
};
