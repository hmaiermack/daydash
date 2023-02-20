import { createRouter } from "./context";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { startOfDay } from "date-fns";


export const taskRouter = createRouter()
    .middleware(async ({ ctx, next }) => {
        if (!ctx.session) {
            throw new TRPCError({code: "UNAUTHORIZED"})
        }
        return next()
    })
    .query('todos', {
        async resolve({ ctx, input }) {
            const today = startOfDay(new Date)
            await ctx.prisma.todo.deleteMany({
                where: {
                    id: ctx.session?.user.id,
                    createdAt: {
                        lte: today
                    }
                }
            })
            //probably delete all todos from before current day, retrieve remaining
            const todos = await ctx.prisma.todo.findMany({
                where: {
                    id: ctx.session?.user.id
                }
            })

            return todos
        }
    })
    .mutation('createTodo', {
        input: z.object({
            title: z.string(),
        }),
        async resolve({ ctx, input }) {
            const todo = await ctx.prisma.todo.create({
                data: {
                    user: {
                        connect: {
                            id: ctx.session?.user.id
                        }
                    },
                    title: input.title,
                    isComplete: false,
                    createdAt: new Date()
                }
            })

            return todo
        }
    })