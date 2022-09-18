import type { AppRouter } from "@routers/AppRouter";

import { createTRPCClient } from "@trpc/client";

export const trpc = createTRPCClient<AppRouter>({
  url: "trpc",
});
