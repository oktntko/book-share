import type { AppRouter } from "@routers/AppRouter";

import { createTRPCClient, TRPCClientError } from "@trpc/client";
import { inferProcedureOutput, inferProcedureInput } from "@trpc/server";

export const trpc = createTRPCClient<AppRouter>({
  url: "/trpc",
});

export function isTRPCClientError(cause: unknown): cause is TRPCClientError<AppRouter> {
  return cause instanceof TRPCClientError;
}

export type Post = inferProcedureOutput<AppRouter["_def"]["queries"]["posts.get"]>;
export type Volume = inferProcedureOutput<AppRouter["_def"]["queries"]["volumes.get"]>;
export type VolumeInput = inferProcedureInput<AppRouter["_def"]["mutations"]["volumes.create"]>;
export type VolumeQuery = inferProcedureInput<AppRouter["_def"]["queries"]["volumes.list"]>;
