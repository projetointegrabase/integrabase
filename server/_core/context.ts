import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { verifyToken } from "./jwt";
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
      const decoded = await verifyToken(token, JWT_SECRET);
      user = {
        userId: decoded.userId as number,
        email: decoded.email as string,
        role: decoded.role as string,
        sector: decoded.sector as string,
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
