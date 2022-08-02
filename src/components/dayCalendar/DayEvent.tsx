import { differenceInMinutes, startOfHour } from 'date-fns';
import React from 'react'

export const DayEvent = ({taskId, taskTitle, taskStart, taskEnd, tagId, tagColorValue, tagName}: {
    taskId: string;
    taskTitle: string;
    taskStart: Date;
    taskEnd: Date;
    tagId?: string | undefined;
    tagColorValue?: string | undefined;
    tagName?: string | undefined;
}) => {

    const minsInHour = 60
    const timeSinceStartOfHour = differenceInMinutes(taskStart, startOfHour(taskStart))

    const percentDifference = (timeSinceStartOfHour / minsInHour)



    const initialTopOffset = 55
    const shiftFullHour = 100

    const shiftPercentage = (shiftFullHour * percentDifference) + initialTopOffset

    console.log({percentDifference,shiftPercentage})
    return (
        <div className='h-40 absolute mx-auto  w-40 bg-blue-300 flex flex-col justify-between items-center' style={{top: `${shiftPercentage}%`, transform: 'translate(12.5%)'}}>
                <div className='mt-2 font-medium text-gray-700'>{taskTitle}</div>
                <div className='flex justify-between w-full p-2'>
                    <span className='text-white text-xs p-1 border rounded-sm'>Edit</span>
                    <span className='text-red-300 text-xs p-1 border border-red-300 rounded-sm'>Delete</span>
                </div>
        </div>
      )
    
}
