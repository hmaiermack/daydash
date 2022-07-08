import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "./context";
import { endOfDay, nextSaturday } from 'date-fns'

export const taskRouter = createRouter()
    .middleware(async ({ ctx, next }) => {
        if (!ctx.session) {
            throw new TRPCError({code: "UNAUTHORIZED"})
        }
        return next()
    })
    .query("tasks", {
        // input: z.object({
        //     startOfWeek: z.date()
        // }),
        async resolve({input, ctx }) {
            // const weekEnd = endOfDay(nextSaturday(input.startOfWeek))
            const user = await ctx.prisma.user.findFirst({
                where: {
                    id: ctx.session?.user.id
                }
            })
            const tasks = await ctx.prisma.task.findMany({
                where: {
                    userId: ctx.session?.user.id
                }
            })
            // console.log(ctx.session)
            return user
        }
    })