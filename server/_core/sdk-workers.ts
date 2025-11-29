import { jwtVerify, SignJWT } from "jose";
import type { Env } from "../../functions/types";

interface TokenResponse {
  accessToken: string;
  refreshToken?: string;
}

interface UserInfo {
  openId: string;
  name?: string;
  email?: string;
  loginMethod?: string;
  platform?: string;
}

export class WorkersSDK {
  private env: Env;

  constructor(env: Env) {
    this.env = env;
  }

  async exchangeCodeForToken(code: string, state: string): Promise<TokenResponse> {
    const redirectUri = atob(state);
    
    const response = await fetch(`${this.env.OAUTH_SERVER_URL}/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        redirectUri,
        appId: this.env.VITE_APP_ID,
      }),
    });

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.statusText}`);
    }

    return await response.json();
  }

  async getUserInfo(accessToken: string): Promise<UserInfo> {
    const response = await fetch(`${this.env.OAUTH_SERVER_URL}/oauth/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Get user info failed: ${response.statusText}`);
    }

    return await response.json();
  }

  async createSessionToken(
    openId: string,
    options: { name: string; expiresInMs: number }
  ): Promise<string> {
    const secret = new TextEncoder().encode(this.env.JWT_SECRET);
    const expiresAt = new Date(Date.now() + options.expiresInMs);

    const token = await new SignJWT({ openId, name: options.name })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(expiresAt)
      .sign(secret);

    return token;
  }

  async verifySessionToken(token: string): Promise<{ openId: string; name: string } | null> {
    try {
      const secret = new TextEncoder().encode(this.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      
      return {
        openId: payload.openId as string,
        name: payload.name as string,
      };
    } catch {
      return null;
    }
  }
}
