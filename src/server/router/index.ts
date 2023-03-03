// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";
import { taskRouter } from "./taskRouter";
import { habitRouter } from "./habitRouter";
import { userRouter } from "./userRouter";
import { todoRouter } from "./todoRouter";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("tasks.", taskRouter)
  .merge("habits.", habitRouter)
  .merge("users.", userRouter)
  .merge("todos.", todoRouter)


// export type definition of API
export type AppRouter = typeof appRouter;
