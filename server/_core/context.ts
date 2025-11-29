import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
// SDK removed - using simple auth

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  // Simple auth - no OAuth
  // In production, implement your own auth logic here
  const user: User | null = null;

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
