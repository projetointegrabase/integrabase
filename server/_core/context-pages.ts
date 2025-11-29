import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";
import type { Env } from "../../functions/_types";

export type TrpcContextPages = {
  req: Request;
  resHeaders: Headers;
  env: Env;
  user: User | null;
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
  let user: User | null = null;

  try {
    // Adaptar SDK para usar env binding
    user = await sdk.authenticateRequest(req, env);
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  return {
    req,
    resHeaders,
    env,
    user,
  };
}
