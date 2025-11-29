import { systemRouter } from "./_core/systemRouter";
import { router } from "./_core/trpc";
import { authRouter } from "./authRouter";

export const appRouter = router({
  system: systemRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
