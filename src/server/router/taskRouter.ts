import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "./context";
import { areIntervalsOverlapping, endOfDay, format, nextSaturday, previousSunday, startOfDay } from 'date-fns'
import { Tag, Task } from "@prisma/client";

export const taskRouter = createRouter()
    .middleware(async ({ ctx, next }) => {
        if (!ctx.session) {
            throw new TRPCError({code: "UNAUTHORIZED"})
        }
        return next()
    })
    .query("tasks", {
        input: z.object({
            startDate: z.date(),
            endDate: z.date()
        }),
        async resolve({ ctx, input }) {
            const verifiedStart = typeof input.startDate === typeof Date ? input.startDate : new Date(input.startDate)
            const verifiedEnd = typeof input.endDate === typeof Date ? input.endDate : new Date(input.endDate)
            const user = await ctx.prisma.user.findUnique({
                where: {
                    id: ctx.session?.user.id
                }
            })

            const tags = await ctx.prisma.tag.findMany({
                where: {
                    userId: ctx.session?.user.id
                }   
            })

            if ( !user ) throw new TRPCError({message: "User not found.", code:"UNAUTHORIZED"})
            const tasks = await ctx.prisma.task.findMany({
                where: {
                    userId: ctx.session?.user.id,
                    timeStart: {
                        gte: verifiedStart,
                    },
                    timeEnd: {
                        lte: verifiedEnd
                    }
                },
                include: {
                    tag: {
                        select: {
                            name: true,
                            colorHexValue: true
                        }
                    }
                },
                orderBy: {
                    timeStart: 'asc'
                }
            })


            return {
                timeRangeStart: user.timeRangeStart,
                timeRangeEnd: user.timeRangeEnd,
                tasks,
                tags
            }
        }
    })
    .mutation("new-task", {
        input: z.object({
            title: z.string(),
            timeStart: z.date(),
            timeEnd: z.date(),
            tag: z.object({
                name: z.string().optional(),
                colorHexValue: z.string().optional()
            }).optional()
        }),
        async resolve ({input, ctx}) {

            if (input.tag && input.tag.colorHexValue && input.tag.name && ctx?.session?.user.id) {
                console.log("inside new task with tag")
                const tags = await ctx.prisma.tag.findMany({
                    where: {
                        userId: ctx.session?.user.id
                    }
                })
                
                //MAKE SURE TAG DOESN'T ALREADY EXIST WITH A DIFFERENT COLOR
                tags.forEach((tag: Tag) => {
                    if (tag.name === input!.tag!.name && tag.colorHexValue != input!.tag!.colorHexValue) {
                        throw new TRPCError({message: "Tag already exists with a different color.", code: "CONFLICT"})
                    }
                })

                // Ensure events aren't overlapping
                // this is a very inefficient way to do this, but it works for now
                const tasks = await ctx.prisma.task.findMany({
                    where: {
                        userId: ctx.session?.user.id
                    }
                })


                tasks.forEach((task: Task) => {
                    if(areIntervalsOverlapping({start: input.timeStart, end: input.timeEnd}, {start: task.timeStart, end: task.timeEnd})) {
                        throw new TRPCError({message: "Events are overlapping.", code: "CONFLICT"})
                    }
                    }
                )

                const task = await ctx.prisma.task.create({
                    data: {
                        user: {
                            connect: {
                                id: ctx.session?.user.id
                            }
                        },
                        title: input.title,
                        timeStart: input.timeStart,
                        timeEnd: input.timeEnd,
                        tag: {
                            connectOrCreate: {
                                where: {
                                    userTag: {
                                        userId: ctx.session?.user.id,
                                        name: input.tag.name,
                                        colorHexValue: input.tag.colorHexValue
                                    }
                                },
                                create: {
                                    name: input.tag.name,
                                    colorHexValue: input.tag.colorHexValue,
                                    user: {
                                        connect: { 
                                            id: ctx.session?.user.id
                                        }
                                    }
                                }
                            }
                        }
                    },
                    include: {
                        tag: true
                    }
                })
                return task
            }   else {
                const task = await ctx.prisma.task.create({
                    data: {
                        user: {
                            connect: {
                                id: ctx.session?.user.id
                            }
                        },
                        title: input.title,
                        timeStart: input.timeStart,
                        timeEnd: input.timeEnd
                    }
                })
                return task
            }            
        }
    })
    .mutation("update-task", {
        input: z.object({
            taskId: z.string(),
            title: z.string().optional(),
            timeStart: z.date().optional(),
            timeEnd: z.date().optional(),
            tag: z.object({
                name: z.string(),
                colorHexValue: z.string()
            }).optional()
        }),
        async resolve({input, ctx}) {
            const task = await ctx.prisma.task.findUnique({
                where: {
                    id: input.taskId
                }
            })

            if (!task) throw new TRPCError({message: "Task not found.", code: "NOT_FOUND"})

            if (input.tag) {
                const updatedTask = await ctx.prisma.task.update({
                    where: {
                      id: input.taskId,
                    },
                    data: {
                      title: input.title ? input.title : task.title,
                      timeStart: input.timeStart ? input.timeStart : task.timeStart,
                      timeEnd: input.timeEnd ? input.timeEnd : task.timeEnd,
                      tag: {
                        upsert: {
                          create: {
                            name: input.tag.name,
                            colorHexValue: input.tag.colorHexValue,
                            user: {
                                connect: { 
                                    id: ctx.session?.user.id
                                }
                            }
                          },
                          update: {
                            name: input.tag.name,
                            colorHexValue: input.tag.colorHexValue,
                          },
                        },
                      },
                    },
                    include: {
                      tag: true,
                    },
                  });
                  return updatedTask;
            }

            const updatedTask = await ctx.prisma.task.update({
                where: {
                  id: input.taskId,
                },
                data: {
                  title: input.title ? input.title : task.title,
                  timeStart: input.timeStart ? input.timeStart : task.timeStart,
                  timeEnd: input.timeEnd ? input.timeEnd : task.timeEnd,
                },
                include: {
                  tag: true,
                },
              });

              return updatedTask
        }
    })
    .mutation("delete-task", {
        input: z.object({
            taskId: z.string()
        }),
        async resolve ({input, ctx}) {
            await ctx.prisma.task.delete({
                where: {
                    id: input.taskId
                }
            })
        }
    })