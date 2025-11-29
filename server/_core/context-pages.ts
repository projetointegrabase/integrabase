import type { User } from "../../drizzle/schema";
import { verifyToken } from "./jwt";
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
      const decoded = await verifyToken(token, jwtSecret);
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
    req,
    resHeaders,
    env,
    user,
    db,
  };
}
