import type { TrpcRouter } from '~/@types:server/router/_TrpcRouter';
import { createTRPCProxyClient, httpLink } from '@trpc/client';
import superjson from 'superjson';

export const trpc = createTRPCProxyClient<typeof TrpcRouter>({
  links: [
    httpLink({
      url: `${import.meta.env.BASE_URL}api/trpc`,
    }),
  ],
  transformer: superjson, // Date to Date
});
