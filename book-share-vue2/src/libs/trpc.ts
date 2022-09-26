import type { AppRouter } from "@routers/AppRouter";

import { createTRPCClient, TRPCClientError } from "@trpc/client";

export const trpc = createTRPCClient<AppRouter>({
  url: "/trpc",
});

export function isTRPCClientError(cause: unknown): cause is TRPCClientError<AppRouter> {
  return cause instanceof TRPCClientError;
}
