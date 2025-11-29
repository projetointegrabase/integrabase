import { COOKIE_NAME, ONE_YEAR_MS } from "../../../shared/const";
import { WorkersSDK } from "../../../server/_core/sdk-workers";
import { initDb, upsertUser } from "../../../server/db-d1";
import type { Env, EventContext } from "../../types";

export async function onRequestGet(context: EventContext<Env>) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || !state) {
    return new Response(JSON.stringify({ error: "code and state are required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Initialize D1 database
    initDb(env.DB);

    // Initialize SDK
    const sdk = new WorkersSDK(env);

    // Exchange code for token
    const tokenResponse = await sdk.exchangeCodeForToken(code, state);
    const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);

    if (!userInfo.openId) {
      return new Response(JSON.stringify({ error: "openId missing from user info" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Upsert user in database
    await upsertUser({
      openId: userInfo.openId,
      name: userInfo.name || null,
      email: userInfo.email ?? null,
      loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
      lastSignedIn: new Date(),
    });

    // Create session token
    const sessionToken = await sdk.createSessionToken(userInfo.openId, {
      name: userInfo.name || "",
      expiresInMs: ONE_YEAR_MS,
    });

    // Get cookie options
    const isSecure = url.protocol === "https:";
    const domain = url.hostname;

    // Set cookie and redirect
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
        "Set-Cookie": `${COOKIE_NAME}=${sessionToken}; Max-Age=${ONE_YEAR_MS / 1000}; Path=/; ${isSecure ? "Secure; " : ""}HttpOnly; SameSite=Lax${domain.includes("pages.dev") ? "" : `; Domain=${domain}`}`,
      },
    });
  } catch (error) {
    console.error("[OAuth] Callback failed", error);
    return new Response(JSON.stringify({ error: "OAuth callback failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
