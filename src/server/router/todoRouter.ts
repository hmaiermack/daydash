import { createRouter } from "./context";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { startOfDay } from "date-fns";


export const todoRouter = createRouter()
    .middleware(async ({ ctx, next }) => {
        if (!ctx.session) {
            throw new TRPCError({code: "UNAUTHORIZED"})
        }
        return next()
    })
    .query('todos', {
        async resolve({ ctx, input }) {
            const today = startOfDay(new Date)
            console.log(today)
            const t = await ctx.prisma.todo.deleteMany({
                where: {
                    userId: ctx.session?.user.id,
                    isComplete: true,
                    createdAt: {
                        lte: today
                    },
                }
            })
            //probably delete all todos from before current day, retrieve remaining
            const todos = await ctx.prisma.todo.findMany({
                where: {
                    userId: ctx.session?.user.id
                }
            })
            return todos
        }
    })
    .mutation('new-todo', {
        input: z.object({
            name: z.string(),
        }),
        async resolve({ ctx, input }) {
            const todo = await ctx.prisma.todo.create({
                data: {
                    user: {
                        connect: {
                            id: ctx.session?.user.id
                        }
                    },
                    name: input.name,
                    isComplete: false,
                    createdAt: new Date()
                }
            })
            console.log(todo)
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