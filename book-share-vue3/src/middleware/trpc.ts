import type { TypeTrpcRouter as TrpcRouter } from "@routers/TrpcRouter";
import { createTRPCProxyClient, httpLink, TRPCClientError } from "@trpc/client";
import type { inferRouterError, inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export const trpc = createTRPCProxyClient<TrpcRouter>({
  links: [
    httpLink({
      url: "/api/trpc",
    }),
  ],
});

export type RouterInput = inferRouterInputs<TrpcRouter>;
export type RouterOutput = inferRouterOutputs<TrpcRouter>;
export type RouterError = inferRouterError<TrpcRouter>;

export function isRouterError(cause: unknown): cause is TRPCClientError<TrpcRouter> {
  return cause instanceof TRPCClientError;
}

type OmitCommon<T> = Omit<T, "created_at" | "created_by" | "updated_by">;

// auth

// category
export type Category = OmitCommon<RouterOutput["category"]["get"]>;

// project
export type Order = OmitCommon<RouterOutput["order"]["get"]>;

// project
export type Project = OmitCommon<RouterOutput["project"]["get"]>;

// status
export type Status = OmitCommon<RouterOutput["status"]["get"]>;

// tag
export type Tag = OmitCommon<RouterOutput["tag"]["get"]>;

// todo
export type Todo = OmitCommon<RouterOutput["todo"]["get"]>;
export type StatusTodo = OmitCommon<RouterOutput["todo"]["board"][number]>;

// user
export type User = OmitCommon<RouterOutput["user"]["get"]>;
