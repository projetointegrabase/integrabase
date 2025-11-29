import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { db } from "./db-d1";
import { athletes } from "../drizzle/schema";
import { eq, desc, like } from "drizzle-orm";

const createAthleteSchema = z.object({
  name: z.string().min(3),
  dateOfBirth: z.string(), // ISO date string
  registrationNumber: z.string(),
  categoryBefore: z.string(),
  categoryCurrent: z.string(),
  transitionDate: z.string(), // ISO date string
  familyContact: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
});

const updateAthleteSchema = createAthleteSchema.partial().extend({
  id: z.number(),
});

export const athletesRouter = router({
  // Criar atleta
  create: publicProcedure
    .input(createAthleteSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.user?.id;
      if (!userId) throw new Error("Não autenticado");
      
      const [athlete] = await db(ctx.env.DB).insert(athletes).values({
        name: input.name,
        dateOfBirth: new Date(input.dateOfBirth),
        registrationNumber: input.registrationNumber,
        categoryBefore: input.categoryBefore,
        categoryCurrent: input.categoryCurrent,
        transitionDate: new Date(input.transitionDate),
        familyContact: input.familyContact,
        phone: input.phone,
        email: input.email,
      }).returning();
      
      return athlete;
    }),
  
  // Listar atletas
  list: publicProcedure
    .input(z.object({
      search: z.string().optional(),
      limit: z.number().default(50),
    }).optional())
    .query(async ({ input, ctx }) => {
      const userId = ctx.user?.id;
      if (!userId) throw new Error("Não autenticado");
      
      let query = db(ctx.env.DB)
        .select()
        .from(athletes)
        .where(eq(athletes.isActive, true))
        .orderBy(desc(athletes.createdAt))
        .limit(input?.limit || 50);
      
      if (input?.search) {
        query = query.where(like(athletes.name, `%${input.search}%`));
      }
      
      return await query;
    }),
  
  // Obter atleta por ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const userId = ctx.user?.id;
      if (!userId) throw new Error("Não autenticado");
      
      const [athlete] = await db(ctx.env.DB)
        .select()
        .from(athletes)
        .where(eq(athletes.id, input.id));
      
      if (!athlete) throw new Error("Atleta não encontrado");
      
      return athlete;
    }),
  
  // Atualizar atleta
  update: publicProcedure
    .input(updateAthleteSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.user?.id;
      if (!userId) throw new Error("Não autenticado");
      
      const { id, ...data } = input;
      
      const updateData: any = { ...data };
      if (data.dateOfBirth) updateData.dateOfBirth = new Date(data.dateOfBirth);
      if (data.transitionDate) updateData.transitionDate = new Date(data.transitionDate);
      updateData.updatedAt = new Date();
      
      const [athlete] = await db(ctx.env.DB)
        .update(athletes)
        .set(updateData)
        .where(eq(athletes.id, id))
        .returning();
      
      return athlete;
    }),
  
  // Deletar atleta (soft delete)
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.user?.id;
      if (!userId) throw new Error("Não autenticado");
      
      await db(ctx.env.DB)
        .update(athletes)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(athletes.id, input.id));
      
      return { success: true };
    }),
});
