export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const APP_TITLE = import.meta.env.VITE_APP_TITLE || "Projeto Integração";
export const APP_SUBTITLE = "Acompanhamento Psicossocial - Sport Club Internacional";
export const APP_LOGO = "/logo-internacional.svg";

/**
 * Cores do Internacional
 */
export const COLORS = {
  PRIMARY_RED: "#C8102E",
  SECONDARY_RED: "#A00D24",
  DARK_RED: "#7A0A1B",
  WHITE: "#FFFFFF",
  BACKGROUND: "#F5F5F5",
  TEXT_PRIMARY: "#000000",
  TEXT_SECONDARY: "rgba(0, 0, 0, 0.87)",
  BORDER: "#E0E0E0",
} as const;

/**
 * Setores do sistema
 */
export const SECTORS = [
  { id: "servico_social", label: "Serviço Social", icon: "👥" },
  { id: "psicologia", label: "Psicologia", icon: "🧠" },
  { id: "pedagogia", label: "Pedagogia", icon: "📚" },
  { id: "nutricao", label: "Nutrição", icon: "🥗" },
  { id: "medicina", label: "Medicina", icon: "⚕️" },
] as const;

/**
 * Roles do sistema
 */
export const ROLES = {
  ADMIN: "admin",
  PSICOLOGO: "psicologo",
  PEDAGOGO: "pedagogo",
  ASSISTENTE_SOCIAL: "assistente_social",
  NUTRICIONISTA: "nutricionista",
  MEDICO: "medico",
} as const;

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};
