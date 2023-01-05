import { Habit } from "@prisma/client"
import { TRPCError } from "@trpc/server"
import { eachDayOfInterval, subDays, subMonths, format, parseISO, isSameDay, startOfToday, endOfToday, isBefore, isAfter, getDay } from "date-fns"
import { Day } from "react-activity-calendar"
import { z } from "zod"
import { GraphDay } from "../../../types/types"
import { createRouter } from "./context"

export const habitRouter = createRouter()
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
                    userId: ctx.session?.user.id,
                    deleted: false
                }
            })
            const reducedHabits = habits.reduce((acc, habit) => {
                const day = getDay(new Date())
                if (habit.habitDays[day] == true) {
                    acc.push(habit)
                }
                return acc
            }, [] as Habit[])



            const completedHabits = await ctx.prisma.completedHabit.findMany({
                where: {
                    userId: ctx.session?.user.id,
                    dateCompleted: {
                        gte: startOfToday(),
                        lte: endOfToday()
                    }
                }
            })
            const habitsWithCompleted = reducedHabits.map(habit => {
                const isCompleted = completedHabits.some(completedHabit => completedHabit.habitId == habit.id)
                return {...habit, isCompleted}
            })
            
            habitsWithCompleted.sort((a, b) => (a.name < b.name ? -1 : (a.name > b.name ? 1 : 0)))


            if(!habits) throw new TRPCError({message: "Something went wrong.", code:"INTERNAL_SERVER_ERROR"})
            return habitsWithCompleted
        }
    })
    .query("habit-graph", {
        async resolve({ ctx }) {
            const habits = await ctx.prisma.habit.findMany({
                where: {
                    userId: ctx.session?.user.id
                },
                orderBy: {
                    createdAt: "asc"
                }
            })

            if(!habits) return {message: "Create a habit to see your adherence graph.", code: "NO_HABITS"}

    

            const completedHabits = await ctx.prisma.completedHabit.findMany({
                where: {
                    userId: ctx.session?.user.id
                },
                orderBy: {
                    dateCompleted: "asc"
                }
            })





            const firstHabitDate = habits[0]!.createdAt

            const intervalStart = subMonths(Date.now(), 6)
            const firstHabitSixMonthsOld = isBefore(firstHabitDate, intervalStart)
            const intervalEnd = subDays(Date.now(), 1)
    
            const intervalArray = eachDayOfInterval({start: intervalStart, end: intervalEnd})
            
            const intervalData: GraphDay[] = []

            const formattedData: Day[] = []

            intervalArray.forEach(date => {
                intervalData.push({
                    date,
                    count: 0,
                    level: 0
                })
            })    
    
            let totalHabits: number = 0
            let totalCompletedHabits: number = 0
            let totalAdherencePercentage: number = 0

    
            intervalData.forEach(item => {
                let completedCount = 0
                const weekday = getDay(item.date)

                //if first habit is newer than 6months don't add count to items before first habit created date
                //we still want these array items to exist so the graph looks nice even when empty

                if(!firstHabitSixMonthsOld) {
                    habits.forEach(habit => {
                        if(!isAfter(habit.createdAt, item.date) || isSameDay(habit.createdAt, item.date)) {
                            if(habit.habitDays[weekday] == true) item.count += 1
                        }
                    }
                    )
                } else {
                    habits.forEach(habit => {
                        if(habit.habitDays[weekday-1] == true) item.count += 1
                    })
                }
                
                //to help determine total adherence of all items we assign completedCount and totalHabits externally of function scope
                completedHabits.forEach(completedHabit => {
                    if(isSameDay(item.date, completedHabit.dateCompleted)) completedCount += 1
                })
                totalHabits += item.count
                totalCompletedHabits += completedCount
                const dailyAdherence = completedCount / item.count
                
                if(dailyAdherence == 1) {
                    item.level = 4
                } else if (dailyAdherence <= .99 && dailyAdherence >= .66) {
                    item.level = 3
                } else if (dailyAdherence <= .65 && dailyAdherence >= .33) {
                    item.level = 2
                } else if (dailyAdherence <= .32 && dailyAdherence >= .01) {
                    item.level = 1
                } else {
                    item.level = 0
                }

                formattedData.push({
                    date: format(item.date, "yyyy-MM-dd"),
                    count: item.count,
                    level: item.level
                })
            })

            totalAdherencePercentage = (totalCompletedHabits / totalHabits) * 100
    
            if(isNaN(totalAdherencePercentage)) {
                totalAdherencePercentage = 0;
            }
            const message = firstHabitSixMonthsOld ? `You've completed ${totalCompletedHabits} of ${totalHabits} possible habits in the last 6 months, adhering ${totalAdherencePercentage}% of the time.` : `You've completed ${totalCompletedHabits} of ${totalHabits} habits since you started tracking your habits on ${format(firstHabitDate, "MM/dd/yy")}.`
            return {formattedData, message}
    
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
            habitId: z.string().cuid()
        }),
        async resolve({input, ctx }) {
            await ctx.prisma.habit.delete({
                where: {
                    id: input.habitId
                }
            })
        }
    })
    .mutation("toggle-habit-completion", {
        input: z.object({
            habitId: z.string().cuid(),
            isComplete: z.boolean()
        }),
        async resolve({input, ctx }) {
            console.log("in toggle", input.isComplete)
            const habit = await ctx.prisma.habit.findUnique({
                where: {
                    id: input.habitId
                }
            })

            if(!habit) throw new TRPCError({ message: "Habit not found.", code:"NOT_FOUND"})

            const startOfDay = startOfToday()
            const endOfDay = endOfToday()

            if(input.isComplete === true){
                    const deleted = await ctx.prisma.completedHabit.deleteMany({
                        where: {
                            habitId: habit.id,
                            dateCompleted: {
                                gte: startOfDay,
                                lt: endOfDay
                            }
                        }
                    })
                    return {message: "Successfully unchecked habit"}
                }
                else {
                    const completedHabit = await ctx.prisma.completedHabit.create({
                        data: {
                            habit: {
                                connect: {
                                    id: habit.id
                                }
                            },
                            user: {
                                connect: {
                                    id: ctx.session?.user.id
                                }
                            }
                        }
                    })
        
                    return completedHabit
            }
        }
    })