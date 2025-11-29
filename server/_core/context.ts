import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import jwt from "jsonwebtoken";
import { getDb } from "../db";

const JWT_SECRET = process.env.JWT_SECRET || "default-secret-change-me";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: { userId: number; email: string; role: string; sector: string } | null;
  db: ReturnType<typeof getDb>;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  const db = getDb();
  
  // Extrair token do header Authorization
  const authHeader = opts.req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
  
  let user: { userId: number; email: string; role: string; sector: string } | null = null;
  
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        sector: decoded.sector,
      };
    } catch (error) {
      // Token inválido ou expirado
      user = null;
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
    db,
  };
}
