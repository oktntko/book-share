import type { AppRouter } from "@routers/AppRouter";

import { createTRPCClient, TRPCClientError } from "@trpc/client";
import { inferProcedureOutput, inferProcedureInput } from "@trpc/server";

export const trpc = createTRPCClient<AppRouter>({
  url: "/trpc",
});

export function isTRPCClientError(cause: unknown): cause is TRPCClientError<AppRouter> {
  return cause instanceof TRPCClientError;
}

export type Book = inferProcedureOutput<AppRouter["_def"]["queries"]["books.get"]>;
export type BookQuery = inferProcedureInput<AppRouter["_def"]["queries"]["books.list"]>;

export type Post = inferProcedureOutput<AppRouter["_def"]["queries"]["posts.get"]>;
export type PostsQuery = inferProcedureInput<AppRouter["_def"]["queries"]["posts.list"]>;

export type DraftInput = inferProcedureInput<AppRouter["_def"]["mutations"]["drafts.create"]>;

export type User = inferProcedureOutput<AppRouter["_def"]["queries"]["users.get"]>;
export type UserInput = inferProcedureInput<AppRouter["_def"]["mutations"]["users.create"]>;
export type UsersQuery = inferProcedureInput<AppRouter["_def"]["queries"]["users.list"]>;

type BookVolumes = inferProcedureOutput<AppRouter["_def"]["queries"]["volumes.search"]>["bookVolumes"];
export type BookVolume = BookVolumes[number];
export type Volume = inferProcedureOutput<AppRouter["_def"]["queries"]["volumes.get"]>;
export type VolumeInput = inferProcedureInput<AppRouter["_def"]["mutations"]["volumes.create"]>;
export type VolumesQuery = inferProcedureInput<AppRouter["_def"]["queries"]["volumes.list"]>;
