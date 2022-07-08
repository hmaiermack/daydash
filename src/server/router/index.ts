// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";
import { taskRouter } from "./taskRouter";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("tasks.", taskRouter)

// export type definition of API
export type AppRouter = typeof appRouter;
