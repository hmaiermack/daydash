// src/server/db/client.ts
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
  });


//middleware that will convert delete queries to update to add soft deletion to habits
//we want to do this as we want to keep completedHabit records
//unfortunately, this means we have to maintain filters in the api layer so as to make sure we don't read/update deleted habits

//MAYBE: should deleted instead be DateTime so we can keep track of when it was deleted?
prisma.$use(async (params, next) => {
  if (params.model == 'Habit') {
    if (params.action == 'delete') {
      // Delete queries
      // Change action to an update
      params.action = 'update'
      params.args['data'] = { deleted: true }
    }
    if (params.action == 'deleteMany') {
      // Delete many queries
      params.action = 'updateMany'
      if (params.args.data != undefined) {
        params.args.data['deleted'] = true
      } else {
        params.args['data'] = { deleted: true }
      }
    }
  }
  return next(params)
})



if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
