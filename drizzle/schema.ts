import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = sqliteTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: integer("id").primaryKey({ autoIncrement: true }),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: text("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: text("email"),
  loginMethod: text("loginMethod"),
  role: text("role", { enum: ["admin", "psicologo", "pedagogo", "assistente_social", "nutricionista", "medico"] }).default("assistente_social").notNull(),
  sector: text("sector", { enum: ["admin", "psicologia", "pedagogia", "servico_social", "nutricao", "medicina"] }).default("servico_social").notNull(),
  isActive: integer("isActive", { mode: "boolean" }).default(true).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  lastSignedIn: integer("lastSignedIn", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Tabela de atletas
 */
export const athletes = sqliteTable("athletes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  dateOfBirth: integer("dateOfBirth", { mode: "timestamp" }).notNull(),
  registrationNumber: text("registrationNumber").notNull().unique(),
  categoryBefore: text("categoryBefore").notNull(),
  categoryCurrent: text("categoryCurrent").notNull(),
  transitionDate: integer("transitionDate", { mode: "timestamp" }).notNull(),
  familyContact: text("familyContact"),
  phone: text("phone"),
  email: text("email"),
  isActive: integer("isActive", { mode: "boolean" }).default(true).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

export type Athlete = typeof athletes.$inferSelect;
export type InsertAthlete = typeof athletes.$inferInsert;

/**
 * Tabela de formulários
 */
export const forms = sqliteTable("forms", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  athleteId: integer("athleteId").notNull(),
  formType: text("formType", { enum: ["social", "psychological", "academic", "nutritional", "medical"] }).notNull(),
  sector: text("sector", { enum: ["servico_social", "psicologia", "pedagogia", "nutricao", "medicina"] }).notNull(),
  submittedBy: integer("submittedBy").notNull(),
  submittedAt: integer("submittedAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  status: text("status", { enum: ["draft", "completed", "reviewed"] }).default("completed").notNull(),
});

export type Form = typeof forms.$inferSelect;
export type InsertForm = typeof forms.$inferInsert;

/**
 * Tabela de respostas de formulários
 */
export const formResponses = sqliteTable("formResponses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  formId: integer("formId").notNull(),
  questionKey: text("questionKey").notNull(),
  questionText: text("questionText").notNull(),
  responseValue: text("responseValue"),
  responseType: text("responseType", { enum: ["text", "number", "select", "checkbox", "scale"] }).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

export type FormResponse = typeof formResponses.$inferSelect;
export type InsertFormResponse = typeof formResponses.$inferInsert;

/**
 * Tabela de logs de auditoria
 */
export const auditLogs = sqliteTable("auditLogs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(),
  action: text("action").notNull(),
  resourceType: text("resourceType"),
  resourceId: integer("resourceId"),
  details: text("details"),
  ipAddress: text("ipAddress"),
  timestamp: integer("timestamp", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;

/**
 * Tabela de cache de análises
 */
export const analysisCache = sqliteTable("analysisCache", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  athleteId: integer("athleteId").notNull(),
  analysisType: text("analysisType").notNull(),
  analysisData: text("analysisData").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  expiresAt: integer("expiresAt", { mode: "timestamp" }),
});

export type AnalysisCache = typeof analysisCache.$inferSelect;
export type InsertAnalysisCache = typeof analysisCache.$inferInsert;
