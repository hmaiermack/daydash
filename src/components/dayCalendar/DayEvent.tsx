import { differenceInMinutes, startOfHour } from 'date-fns';
import React from 'react'

const getShiftPercentage = (startTime: Date): number => {
    const minsInHour = 60
    const timeSinceStartOfHour = differenceInMinutes(startTime, startOfHour(startTime))

    const percentDifference = (timeSinceStartOfHour / minsInHour)



    const initialTopOffset = 55
    const shiftFullHour = 100

    return ((shiftFullHour * percentDifference) + initialTopOffset)

}

const getHeight = (startTime: Date, endTime: Date): number => {
    const defaultCellHeight = 5
    const totalLengthInMins = differenceInMinutes(endTime, startTime)


    const percentOfHour = totalLengthInMins / 60

    console.log({totalLengthInMins, percentOfHour})

    return defaultCellHeight * percentOfHour
}

export const DayEvent = ({taskId, taskTitle, taskStart, taskEnd, tagId, tagColorValue, tagName}: {
    taskId: string;
    taskTitle: string;
    taskStart: Date;
    taskEnd: Date;
    tagId?: string | undefined;
    tagColorValue?: string | undefined;
    tagName?: string | undefined;
}) => {

    const shiftPercentage = getShiftPercentage(taskStart)
    const divHeight = getHeight(taskStart, taskEnd)

    return (
        <div className='absolute w-40 bg-blue-300 flex flex-col justify-between items-center' style={{top: `${shiftPercentage}%`, transform: 'translate(12.5%)', height: `${divHeight}rem`}}>
                <div className='mt-2 font-medium text-gray-700'>{taskTitle}</div>
                <div className='flex justify-between w-full p-2'>
                    <span className='text-white text-xs p-1 border rounded-sm'>Edit</span>
                    <span className='text-red-300 text-xs p-1 border border-red-300 rounded-sm'>Delete</span>
                </div>
        </div>
      )
    
}
