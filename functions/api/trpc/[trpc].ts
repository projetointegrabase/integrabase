import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '../../../server/routers';
import { createContext } from '../../../server/_core/context-pages';

export const onRequest: PagesFunction<Env> = async (context) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: context.request,
    router: appRouter,
    createContext: () => createContext({
      req: context.request,
      resHeaders: new Headers(),
      env: context.env,
    }),
    onError:
      process.env.NODE_ENV === 'development'
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`,
            );
          }
        : undefined,
  });
};
