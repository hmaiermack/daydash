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
    .mutation('create-todo', {
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
    .mutation('toggle-todo', {
        input: z.object({
            id: z.string()
            }),
            async resolve({ ctx, input }) {
                const todo = await ctx.prisma.todo.findUnique({
                    where: {
                        id: input.id
                        }
                })
                if (!todo) throw new TRPCError({message: "Todo not found.", code:"NOT_FOUND"})
                const updatedTodo = await ctx.prisma.todo.update({
                    where: {
                        id: input.id
                        },
                        data: {
                        isComplete: !todo.isComplete
                        }
                })
                return updatedTodo
        }
    })
    .mutation('delete-todo', {
        input: z.object({
            id: z.string()
            }),
            async resolve({ ctx, input }) {
                const todo = await ctx.prisma.todo.findUnique({
                    where: {
                        id: input.id
                        }
                })
                if (!todo) throw new TRPCError({message: "Todo not found.", code:"NOT_FOUND"})
                const deletedTodo = await ctx.prisma.todo.delete({
                    where: {
                        id: input.id
                        }
                })
                return deletedTodo
        }
    })