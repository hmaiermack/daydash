import { addHours, differenceInMinutes, format, startOfDay, startOfHour } from 'date-fns';
import React, { useContext, useEffect, useRef } from 'react'
import { EventInteractionModalContext, EventInteractionModalContextType } from '../../context/EventInteractionModalContext';

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
    return offset
}

export const Event = ({taskId, taskTitle, taskStart, taskEnd, tagId, tagColorValue, tagName, steps, parentHeight, startHour, parentLeftOffset}: {
    taskId: string;
    taskTitle: string;
    taskStart: Date;
    taskEnd: Date;
    tagId?: string | null;
    tagColorValue?: string | null;
    tagName?: string | null;
    steps: number;
    parentHeight: number;
    parentLeftOffset: number;
    startHour: number
}) => {

    const ref = useRef<HTMLButtonElement>(null)
    const { setReferenceLeftOffset, setReferenceTopOffset, setIsEventInteractionModalOpen } = useContext(EventInteractionModalContext) as EventInteractionModalContextType

    const date = new Date

    const eventLength = differenceInMinutes(taskEnd, taskStart)
    const divHeight = getEventHeight(parentHeight, steps, eventLength)


    const start = addHours(startOfDay(taskStart), startHour)
    const topOffset = getTopOffset(taskStart, start, steps)
    //min height to fit title and time on two lines
    const minDivHeight = 2.08

    console.log({ref: ref.current})

    const handleClick = () => {
        if(ref.current){
            //get left offset position of parent day column and top offset from event
            setReferenceLeftOffset(parentLeftOffset)
            setReferenceTopOffset(ref.current.offsetTop)
            setIsEventInteractionModalOpen(true)
        }
    }

    return (
        <button key={taskId} ref={ref} className={`${date > taskEnd ? 'hover:saturate-150' : 'hover:saturate-150'} absolute w-[95%] ${tagColorValue ? '' : 'bg-blue-300'} z-50 flex flex-col overflow-auto rounded-sm`} style={{top: `${topOffset}%`, height: `${divHeight}px`, backgroundColor: tagColorValue ? tagColorValue : ''}} onClick={handleClick}>
                <span className='absolute -top-1 text-center right-[2px] text-xs'>...</span>
                <span className=' block mt-1 ml-1 text-left font-light text-xs text-gray-700 leading-none'>{taskTitle}{divHeight > minDivHeight ? <br></br> : ''}{divHeight > minDivHeight ? `${format(taskStart, "h:mm")} - ${format(taskEnd, "hp")}` : `, ${format(taskStart, "h:mm")}`}</span>
                {tagName && <pre className='absolute text-[8px] bottom-[2px] right-[2px] px-[2px] rounded-sm border border-gray-400'>{tagName}</pre>}
        </button>
      )
    
}
