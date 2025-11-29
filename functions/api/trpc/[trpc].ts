import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '../../../server/routers';
import { createContext } from '../../../server/_core/context';
import type { Env, EventContext } from '../../types';

// Handler tRPC para Cloudflare Pages Functions
export const onRequest = async (context: EventContext<Env>) => {
  const { request, env } = context;

  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: request,
    router: appRouter,
    createContext: ({ req, resHeaders }) => createContext({ req, resHeaders, env }),
    onError: ({ error, path }) => {
      console.error(`tRPC Error on path '${path}':`, error);
    },
  });
};
