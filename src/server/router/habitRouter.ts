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
        async resolve({input, ctx }) {
            const habits = await ctx.prisma.habit.findMany({
                where: {
                    userId: ctx.session?.user.id
                }
            })

            if(!habits) throw new TRPCError({message: "No habits found", code:"NOT_FOUND"})
            return habits
        }
    })
    .query("habit-graph", {
        async resolve({input, ctx }) {

        }
    })
    .mutation("new-habit", {
        input: z.object({

        }),
        async resolve({input, ctx }) {
            
        }
    })
    .mutation("update-habit", {
        input: z.object({

        }),
        async resolve({input, ctx }) {
            
        }
    })
    .mutation("delete-habit", {
        input: z.object({

        }),
        async resolve({input, ctx }) {
            
        }
    })
    .mutation("do-habit", {
        input: z.object({

        }),
        async resolve({input, ctx }) {
            
        }
    })
    .mutation("undo-habit", {
        input: z.object({

        }),
        async resolve({input, ctx }) {
            
        }
    })
