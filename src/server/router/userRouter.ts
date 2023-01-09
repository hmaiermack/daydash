import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { createRouter } from "./context"

export const habitRouter = createRouter()
    .middleware(async ({ ctx, next }) => {
        if (!ctx.session) {
            throw new TRPCError({code: "UNAUTHORIZED"})
        }
        return next()
    })
    .mutation("change-time-range", {
        input: z.object({
            timeStart: z.number(),
            timeEnd: z.number(),
        }),
        async resolve ({ input, ctx }) {
            const { timeStart, timeEnd } = input
            const user = await ctx.prisma.user.update({
                where: {
                    id: ctx.session?.user.id,
                },
                data: {
                    timeRangeStart: timeStart,
                    timeRangeEnd: timeEnd,
                }
            })
            return user
        },
    })
