import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "./context";
import { endOfDay, format, nextSaturday, previousSunday, startOfDay } from 'date-fns'
import { Tag, Task } from "@prisma/client";
import { ProcessedEvent } from "@aldabil/react-scheduler/dist/types";

export const taskRouter = createRouter()
    .middleware(async ({ ctx, next }) => {
        if (!ctx.session) {
            throw new TRPCError({code: "UNAUTHORIZED"})
        }
        return next()
    })

    /*
    interface CalendarEvent {
    event_id: number | string;
    title: string;
    start: Date;
    end: Date;
    */
    .query("tasks", {
        input: z.object({
            date: z.date()
        }),
        async resolve({ ctx }) {
            const user = await ctx.prisma.user.findUnique({
                where: {
                    id: ctx.session?.user.id
                }
            })

            if ( !user ) throw new TRPCError({message: "User not found.", code:"UNAUTHORIZED"})
            const tasks = await ctx.prisma.task.findMany({
                where: {
                    userId: ctx.session?.user.id,
                },
                include: {
                    tag: true,
                },
                orderBy: {
                    timeStart: 'asc'
                }
            })


            return {
                timeRangeStart: user.timeRangeStart,
                timeRangeEnd: user.timeRangeEnd,
                tasks
            }
        }
    })
    .mutation("new-task", {
        input: z.object({
            title: z.string(),
            timeStart: z.date(),
            timeEnd: z.date(),
            tag: z.object({
                name: z.string(),
                colorHexValue: z.string().optional()
            }).optional()
        }),
        async resolve ({input, ctx}) {
            if (input.tag) {
                console.log("inside new task with tag")
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
                                    name: input.tag.name
                                },
                                create: {
                                    name: input.tag.name,
                                    colorHexValue: input.tag.colorHexValue
                                }
                            }
                        }
                    },
                    include: {
                        tag: true
                    }
                })
                const e = {
                    event_id: task.id,
                    title: task.title,
                    start: task.timeStart,
                    end: task.timeEnd,
                    tagInfo: {
                        id: task.tag?.id,
                        name: task.tag?.name,
                        color: task.tag?.colorHexValue
                    }
                }

                return e
            }   

            console.log("new task without tag")
            
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

            const e = {
                event_id: task.id,
                title: task.title,
                start: task.timeStart,
                end: task.timeEnd,
            }

            return e

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
                colorHexValue: z.string().optional()
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
            return ctx.res?.send({message: "Successfully deleted."})
        }
    })