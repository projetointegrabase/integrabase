export const ENV = {
  appId: process.env.VITE_APP_ID ?? "integrabase",
  cookieSecret: process.env.JWT_SECRET ?? "change-me-in-production",
  databaseUrl: process.env.DATABASE_URL ?? "",
  isProduction: process.env.NODE_ENV === "production",
  // OAuth removed - using simple auth instead
  ownerEmail: process.env.OWNER_EMAIL ?? "admin@integrabase.com",
};
