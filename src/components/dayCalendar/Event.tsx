import { addHours, differenceInMinutes, format, startOfDay, startOfHour } from 'date-fns';
import React, { useContext, useEffect, useRef } from 'react'
import { EventInteractionModalContext } from '../../context/EventInteractionModalContext';
import determineTextColor from '../../utils/determineTextColor';

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

export const Event = ({taskId, taskTitle, taskStart, taskEnd, tagId, tagColorValue, tagName, steps, parentHeight, parentWidth, startHour, parentLeftOffset, colIdx}: {
    taskId: string;
    taskTitle: string;
    taskStart: Date;
    taskEnd: Date;
    tagId?: string | null;
    tagColorValue?: string | null;
    tagName?: string | null;
    steps: number;
    parentHeight: number;
    parentWidth: number;
    parentLeftOffset: number;
    colIdx: number;
    startHour: number
}) => {

    const ref = useRef<HTMLButtonElement>(null)
    const { state, dispatch } = useContext(EventInteractionModalContext)

    const date = new Date

    const eventLength = differenceInMinutes(taskEnd, taskStart)
    const divHeight = getEventHeight(parentHeight, steps, eventLength)


    const start = addHours(startOfDay(taskStart), startHour)
    const topOffset = getTopOffset(taskStart, start, steps)
    //min height to fit title and time on two lines
    const minDivHeight = 40

    const textColor = tagColorValue ? determineTextColor(tagColorValue) : 'black'

    const handleClick = () => {
        if(ref.current){
            tagColorValue && tagName ?
            dispatch({type: "openModal", payload: {
                isEventInteractionModalOpen: true,
                referenceTopOffset: ref.current.offsetTop,
                calendarHeight: parentHeight,
                referenceLeftOffset: parentLeftOffset,
                columnIdx: colIdx,
                referenceWidth: parentWidth,
                eventTitle: taskTitle,
                eventStart: taskStart,
                eventEnd: taskEnd,
                eventId: taskId,
                eventTagName: tagName,
                eventTagColor: tagColorValue
            }}) :
            dispatch({type: "openModal", payload: {
                isEventInteractionModalOpen: true,
                referenceTopOffset: ref.current.offsetTop,
                calendarHeight: parentHeight,
                referenceLeftOffset: parentLeftOffset,
                columnIdx: colIdx,
                referenceWidth: parentWidth,
                eventTitle: taskTitle,
                eventStart: taskStart,
                eventEnd: taskEnd,
                eventId: taskId,
            }})
        }
    }

    return (
        <button key={taskId} ref={ref} className={`${date > taskEnd ? 'hover:saturate-150 opacity-25' : 'hover:saturate-150'} absolute w-[95%] ${tagColorValue ? '' : 'bg-blue-300'} z-50 flex flex-col overflow-auto rounded-sm`} style={{top: `${topOffset}%`, height: `${divHeight}px`, backgroundColor: tagColorValue ? tagColorValue : ''}} onClick={handleClick}>
                <span className={`block mt-1 ml-1 text-left font-light text-xs text-${textColor} leading-none`}>
                    {taskTitle}{divHeight > minDivHeight/2 ? <br></br> : ''}{divHeight > minDivHeight ? `${format(taskStart, "h:mm")} - ${format(taskEnd, "hp")}` : ` ${format(taskStart, "h:mm a")}`}
                </span>
                {tagName && <pre className={`absolute text-[8px] text-${textColor} bottom-[2px] right-[2px] px-[2px] rounded-sm border border${textColor === "black" ? ' border-black' : "border-white"}`}>{tagName}</pre>}
        </button>
      )
    
}
