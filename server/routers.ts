import { systemRouter } from "./_core/systemRouter";
import { router } from "./_core/trpc";
import { authRouter } from "./authRouter";
import { socialFormsRouter } from "./socialFormsRouter";
import { athletesRouter } from "./athletesRouter";

export const appRouter = router({
  system: systemRouter,
  auth: authRouter,
  socialForms: socialFormsRouter,
  athletes: athletesRouter,
});

export type AppRouter = typeof appRouter;
