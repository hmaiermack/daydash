import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { createRouter } from "./context"

export const taskRouter = createRouter()
    .middleware(async ({ ctx, next }) => {
        if (!ctx.session) {
            throw new TRPCError({code: "UNAUTHORIZED"})
        }
        return next()
    })
    .query("habits", {
        async resolve() {

        }
    })
    .query("habit-graph", {
        async resolve () {

        }
    })
    .mutation("new-habit", {
        input: z.object({

        }),
        async resolve () {
            
        }
    })
    .mutation("update-habit", {
        input: z.object({

        }),
        async resolve () {
            
        }
    })
    .mutation("delete-habit", {
        input: z.object({

        }),
        async resolve () {
            
        }
    })
    .mutation("do-habit", {
        input: z.object({

        }),
        async resolve () {
            
        }
    })
    .mutation("undo-habit", {
        input: z.object({

        }),
        async resolve () {
            
        }
    })
