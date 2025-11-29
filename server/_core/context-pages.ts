import type { User } from "../../drizzle/schema";
import jwt from "jsonwebtoken";
import { drizzle } from "drizzle-orm/d1";
import type { Env } from "../../functions/types";

export type TrpcContextPages = {
  req: Request;
  resHeaders: Headers;
  env: Env;
  user: { userId: number; email: string; role: string; sector: string } | null;
  db: ReturnType<typeof drizzle>;
};

export async function createContext({
  req,
  resHeaders,
  env,
}: {
  req: Request;
  resHeaders: Headers;
  env: Env;
}): Promise<TrpcContextPages> {
  const db = drizzle(env.DB);
  
  // Extrair token do header Authorization
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
  
  let user: { userId: number; email: string; role: string; sector: string } | null = null;
  
  if (token) {
    try {
      const jwtSecret = env.JWT_SECRET || "default-secret-change-me";
      const decoded = jwt.verify(token, jwtSecret) as any;
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
    req,
    resHeaders,
    env,
    user,
    db,
  };
}
