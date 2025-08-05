import type { TrpcRouter } from '~/@types:server/router/_TrpcRouter';
import { TRPCClientError } from '@trpc/client';
import type { inferRouterError, inferRouterInputs, inferRouterOutputs } from '@trpc/server';

export type RouterInput = inferRouterInputs<typeof TrpcRouter>;
export type RouterOutput = inferRouterOutputs<typeof TrpcRouter>;
export type RouterError = inferRouterError<typeof TrpcRouter>;

export function isRouterError(cause: unknown): cause is TRPCClientError<typeof TrpcRouter> {
  return cause instanceof TRPCClientError;
}
