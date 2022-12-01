import { addHours, differenceInMinutes, format, startOfDay, startOfHour } from 'date-fns';
import React from 'react'

const getEventHeight = (parentHeight: number, steps: number, lengthOfEventInMins: number): number => {
    const totalMinutesForDay = steps * 60

    const percentagePerMinute = parentHeight / totalMinutesForDay

    const height = percentagePerMinute * lengthOfEventInMins
    return height

}

const getTopOffset = (startOfEvent: Date, startOfDay: Date, steps: number): number => {
    const totalMinutesForDay = steps * 60

    const diffInMinutes = differenceInMinutes(startOfEvent, startOfDay)

    // toFixed rounds to two decimals but returns string so have to parse result
    const offset = parseFloat(((diffInMinutes / totalMinutesForDay) * 100).toFixed(2))
    console.log(offset)
    return offset
}

export const Event = ({taskId, taskTitle, taskStart, taskEnd, tagId, tagColorValue, tagName, steps, parentHeight, startHour}: {
    taskId: string;
    taskTitle: string;
    taskStart: Date;
    taskEnd: Date;
    tagId?: string | undefined;
    tagColorValue?: string | undefined;
    tagName?: string | undefined;
    steps: number;
    parentHeight: number;
    startHour: number
}) => {

    console.log(parentHeight)
    const date = new Date

    const handleClick = () => {
        console.log(`clicked from ${taskTitle}`)
    }
    const eventLength = differenceInMinutes(taskEnd, taskStart)
    const divHeight = getEventHeight(parentHeight, steps, eventLength)


    const start = addHours(startOfDay(taskStart), startHour)
    const topOffset = getTopOffset(taskStart, start, steps)
    //min height to fit title and time on two lines
    const minDivHeight = 2.08

    return (
        <button key={taskId} className={`${date > taskEnd ? 'hover:saturate-150' : 'hover:saturate-150'} absolute w-[85%] bg-blue-300 z-50 flex flex-col overflow-auto rounded-sm`} style={{top: `${topOffset}%`, height: `${divHeight}px`}} onClick={() => handleClick}>
                <span className=' block mt-1 ml-1 text-left font-light text-sm text-gray-700 leading-none'>{taskTitle}{divHeight > minDivHeight ? <br></br> : ''}{divHeight > minDivHeight ? `${format(taskStart, "h:mm")} - ${format(taskEnd, "hp")}` : `, ${format(taskStart, "h:mm")}`}</span>
        </button>
      )
    
}
