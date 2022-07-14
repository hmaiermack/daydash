import { TRPCError } from "@trpc/server"
import { eachDayOfInterval, subDays, subMonths, format, parseISO, isSameDay } from "date-fns"
import { z } from "zod"
import { Day } from "../../../types/types"
import { createRouter } from "./context"

export const taskRouter = createRouter()
    .middleware(async ({ ctx, next }) => {
        if (!ctx.session) {
            throw new TRPCError({code: "UNAUTHORIZED"})
        }
        return next()
    })
    .query("habits", {
        async resolve({ ctx }) {
            const habits = await ctx.prisma.habit.findMany({
                where: {
                    userId: ctx.session?.user.id
                }
            })

            if(!habits) throw new TRPCError({message: "Something went wrong.", code:"INTERNAL_SERVER_ERROR"})
            return habits
        }
    })
    .query("habit-graph", {
        async resolve({ ctx }) {
            const habits = await ctx.prisma.habit.findMany({
                where: {
                    userId: ctx.session?.user.id
                }
            })
    
            const completedHabits = await ctx.prisma.completedHabit.findMany({
                where: {
                    userId: ctx.session?.user.id
                }
            })

            const intervalStart = subMonths(Date.now(), 3)
            const intervalEnd = subDays(Date.now(), 1)
    
            const intervalArray = eachDayOfInterval({start: intervalStart, end: intervalEnd})
            
            const intervalData: Day[] = []
            
            //populate the intervalData with proplerly formatted date
            intervalArray.forEach(date => {
                let dateString = format(date, "yyyy-MM-dd")
                intervalData.push({
                    date: dateString,
                    count: 0,
                    level: 0
                })
            })
    
    
            let adherencePercentage: number = 0
    
            intervalData.forEach(item => {
                const weekday = parseInt(format(parseISO(item.date), "i"))
                let completedCount = 0
                
                habits.forEach(habit => {
                    if(habit.habitDays[weekday-1] == true) item.count += 1
                })
    
                completedHabits.forEach(completedHabit => {
                    // console.log({
                    //     itemDate: parseISO(item.date),
                    //     completeDate: completedHabit.dateCompleted,
                    //     isSame: isSameDay(parseISO(item.date), completedHabit.dateCompleted)
                    // })
                    if(isSameDay(parseISO(item.date), completedHabit.dateCompleted)) completedCount += 1
                })
                adherencePercentage = completedCount / item.count
                
                if(adherencePercentage == 1) {
                    item.level = 4
                } else if (adherencePercentage <= .99 && adherencePercentage >= .66) {
                    item.level = 3
                } else if (adherencePercentage <= .65 && adherencePercentage >= .33) {
                    item.level = 2
                } else if (adherencePercentage <= .32 && adherencePercentage >= .01) {
                    item.level = 1
                } else {
                    item.level = 0
                }
            })
    
            if(isNaN(adherencePercentage)) {
                adherencePercentage = 0;
            }
            
            return {intervalData, adherencePercentage}
    
        }
    })
    .mutation("new-habit", {
        input: z.object({
            name: z.string().min(1, {message: "Name can't be empty"}),
            habitDays: z.array(z.boolean()).length(7),
            remindTime: z.string().optional(),
            remindDays: z.array(z.boolean()).optional()
        }),
        async resolve({input, ctx }) {
            if(input.remindTime) {
                const habit = await ctx.prisma.habit.create({
                    data: {
                        user: {
                            connect: {
                                id: ctx.session?.user.id
                            }
                        },
                        name: input.name,
                        habitDays: input.habitDays,
                        remindTime: input.remindTime,
                        remindDays: input.remindDays
                    }
                })
    
                return habit
            }
    
            const habit = await ctx.prisma.habit.create({
                data: {
                    user: {
                        connect: {
                            id: ctx.session?.user.id
                        }
                    },
                    name: input.name,
                    habitDays: input.habitDays,
                }
    
            })
    
            return habit
    
        }
    })
    .mutation("update-habit", {
        input: z.object({
            habitId: z.string().cuid(),
            name: z.string().min(1, {message: "Name can't be empty"}).optional(),
            habitDays: z.array(z.boolean()).length(7).optional(),
            remindTime: z.string().optional(),
            remindDays: z.array(z.boolean()).optional()
        }),
        async resolve({input, ctx }) {
            const habit = await ctx.prisma.habit.findUnique({
                where: {
                    id: input.habitId
                }
            })

            if(!habit) throw new TRPCError({ message: "Habit not found.", code:"NOT_FOUND"})
    
            const updatedHabit = await ctx.prisma.habit.update({
                where: {
                    id: input.habitId
                },
                data: {
                    name: input.name ? input.name : habit.name,
                    habitDays: input.habitDays ? input.habitDays : habit.habitDays,
                    remindTime: input.remindTime ? input.remindTime : habit.remindTime,
                    remindDays: input.remindDays ? input.remindDays : habit.remindDays
    
                }
            })
    
            return updatedHabit
    
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
