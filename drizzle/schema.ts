import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["admin", "psicologo", "pedagogo", "assistente_social", "nutricionista", "medico"]).default("assistente_social").notNull(),
  sector: mysqlEnum("sector", ["admin", "psicologia", "pedagogia", "servico_social", "nutricao", "medicina"]).default("servico_social").notNull(),
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Tabela de atletas
 */
export const athletes = mysqlTable("athletes", {
  id: int("id").autoincrement().primaryKey(),
  name: text("name").notNull(),
  dateOfBirth: timestamp("dateOfBirth").notNull(),
  registrationNumber: varchar("registrationNumber", { length: 64 }).notNull().unique(),
  categoryBefore: varchar("categoryBefore", { length: 64 }).notNull(),
  categoryCurrent: varchar("categoryCurrent", { length: 64 }).notNull(),
  transitionDate: timestamp("transitionDate").notNull(),
  familyContact: text("familyContact"),
  phone: varchar("phone", { length: 32 }),
  email: varchar("email", { length: 320 }),
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Athlete = typeof athletes.$inferSelect;
export type InsertAthlete = typeof athletes.$inferInsert;

/**
 * Tabela de formulários
 */
export const forms = mysqlTable("forms", {
  id: int("id").autoincrement().primaryKey(),
  athleteId: int("athleteId").notNull(),
  formType: mysqlEnum("formType", ["social", "psychological", "academic", "nutritional", "medical"]).notNull(),
  sector: mysqlEnum("sector", ["servico_social", "psicologia", "pedagogia", "nutricao", "medicina"]).notNull(),
  submittedBy: int("submittedBy").notNull(),
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  status: mysqlEnum("status", ["draft", "completed", "reviewed"]).default("completed").notNull(),
});

export type Form = typeof forms.$inferSelect;
export type InsertForm = typeof forms.$inferInsert;

/**
 * Tabela de respostas de formulários
 */
export const formResponses = mysqlTable("formResponses", {
  id: int("id").autoincrement().primaryKey(),
  formId: int("formId").notNull(),
  questionKey: varchar("questionKey", { length: 128 }).notNull(),
  questionText: text("questionText").notNull(),
  responseValue: text("responseValue"),
  responseType: mysqlEnum("responseType", ["text", "number", "select", "checkbox", "scale"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type FormResponse = typeof formResponses.$inferSelect;
export type InsertFormResponse = typeof formResponses.$inferInsert;

/**
 * Tabela de logs de auditoria
 */
export const auditLogs = mysqlTable("auditLogs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  action: varchar("action", { length: 64 }).notNull(),
  resourceType: varchar("resourceType", { length: 64 }),
  resourceId: int("resourceId"),
  details: text("details"),
  ipAddress: varchar("ipAddress", { length: 64 }),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;

/**
 * Tabela de cache de análises
 */
export const analysisCache = mysqlTable("analysisCache", {
  id: int("id").autoincrement().primaryKey(),
  athleteId: int("athleteId").notNull(),
  analysisType: varchar("analysisType", { length: 64 }).notNull(),
  analysisData: text("analysisData").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt"),
});

export type AnalysisCache = typeof analysisCache.$inferSelect;
export type InsertAnalysisCache = typeof analysisCache.$inferInsert;