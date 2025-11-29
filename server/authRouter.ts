import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "./_core/trpc";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { TRPCError } from "@trpc/server";

export const authRouter = router({
  // Login
  login: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(6),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!('db' in ctx) || !ctx.db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const { email, password } = input;
      const JWT_SECRET = ('env' in ctx && ctx.env?.JWT_SECRET) || process.env.JWT_SECRET || "default-secret-change-me";
      
      // Buscar usuário
      const result = await ctx.db.select().from(users).where(eq(users.email, email)).limit(1);
      const user = result[0];
      
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Email ou senha incorretos",
        });
      }
      
      // Verificar senha
      const isValid = await bcrypt.compare(password, user.passwordHash);
      
      if (!isValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Email ou senha incorretos",
        });
      }
      
      // Gerar token JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role, sector: user.sector },
        JWT_SECRET,
        { expiresIn: "7d" }
      );
      
      // Atualizar lastSignedIn
      await ctx.db.update(users)
        .set({ lastSignedIn: new Date() })
        .where(eq(users.id, user.id));
      
      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          sector: user.sector,
        },
      };
    }),
  
  // Get current user
  me: protectedProcedure
    .query(async ({ ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      if (!('db' in ctx) || !ctx.db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }
      
      const result = await ctx.db.select().from(users).where(eq(users.id, ctx.user.userId)).limit(1);
      const user = result[0];
      
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        sector: user.sector,
      };
    }),
  
  // List all users (admin only)
  listUsers: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      if (!('db' in ctx) || !ctx.db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }
      
      const allUsers = await ctx.db.select().from(users).all();
      
      return allUsers.map(u => ({
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        sector: u.sector,
        isActive: u.isActive,
        createdAt: u.createdAt,
        lastSignedIn: u.lastSignedIn,
      }));
    }),
  
  // Create user (admin only)
  createUser: protectedProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(6),
      name: z.string().min(1),
      role: z.enum(["admin", "psicologo", "pedagogo", "assistente_social", "nutricionista", "medico"]),
      sector: z.enum(["admin", "psicologia", "pedagogia", "servico_social", "nutricao", "medicina"]),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      if (!('db' in ctx) || !ctx.db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }
      
      // Verificar se email já existe
      const existing = await ctx.db.select().from(users).where(eq(users.email, input.email)).limit(1);
      if (existing.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email já cadastrado",
        });
      }
      
      // Hash da senha
      const passwordHash = await bcrypt.hash(input.password, 10);
      
      // Criar usuário
      const result = await ctx.db.insert(users).values({
        email: input.email,
        passwordHash,
        name: input.name,
        role: input.role,
        sector: input.sector,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      }).returning();
      
      return result[0];
    }),
  
  // Update user (admin only)
  updateUser: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().min(1).optional(),
      role: z.enum(["admin", "psicologo", "pedagogo", "assistente_social", "nutricionista", "medico"]).optional(),
      sector: z.enum(["admin", "psicologia", "pedagogia", "servico_social", "nutricao", "medicina"]).optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      if (!('db' in ctx) || !ctx.db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }
      
      const { id, ...updates } = input;
      
      await ctx.db.update(users)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(users.id, id));
      
      return { success: true };
    }),
  
  // Change password
  changePassword: protectedProcedure
    .input(z.object({
      userId: z.number(),
      newPassword: z.string().min(6),
    }))
    .mutation(async ({ input, ctx }) => {
      // Admin pode mudar senha de qualquer um, usuário só pode mudar a própria
      if (ctx.user?.role !== "admin" && ctx.user?.userId !== input.userId) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      if (!('db' in ctx) || !ctx.db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }
      
      const passwordHash = await bcrypt.hash(input.newPassword, 10);
      
      await ctx.db.update(users)
        .set({ passwordHash, updatedAt: new Date() })
        .where(eq(users.id, input.userId));
      
      return { success: true };
    }),
  
  // Delete user (admin only)
  deleteUser: protectedProcedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      if (!('db' in ctx) || !ctx.db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }
      
      // Não permitir deletar a si mesmo
      if (ctx.user.userId === input.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Você não pode deletar sua própria conta",
        });
      }
      
      await ctx.db.delete(users).where(eq(users.id, input.id));
      
      return { success: true };
    }),
});
