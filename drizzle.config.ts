import type { Config } from "drizzle-kit";

export default {
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  driver: "d1",
  dialect: "sqlite",
  dbCredentials: {
    wranglerConfigPath: "./wrangler.toml",
    dbName: "projeto-integracao-db",
  },
} satisfies Config;
