// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";
import { taskRouter } from "./taskRouter";
import { habitRouter } from "./habitRouter";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("tasks.", taskRouter)
  .merge("habits.", habitRouter)

// export type definition of API
export type AppRouter = typeof appRouter;
