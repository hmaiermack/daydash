import { Task } from '@prisma/client'
import { addHours, isBefore, isSameDay, startOfDay } from 'date-fns';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { CalendarContext } from '../../context/CalendarContext';
import { getTopOffset } from '../../utils/getTopOffset';
import { Event } from './Event';
import useWindowSize from '../../hooks/useWindowSize';
import HourMarker from './HourMarker';

const Day = ({tasks, timeRangeStart, timeRangeEnd, colIdx, day}: {
    tasks: (Task & {
        tag: {
            name: string;
            colorHexValue: string;
        } | null;})[], 
    timeRangeStart: number, timeRangeEnd: number, colIdx: number, day: Date | undefined}) => {

    const { state } = useContext(CalendarContext)
    const [height, setHeight] = useState<number>(0)
    const [leftOffset, setLeftOffset] = useState<number>(0)
    const [width, setWidth] = useState<number>(0)
    const dayRef = useRef<HTMLDivElement>(null)

    //will reposition time marker correctly on window resize, TBD if this broke things
    //if things get fucky, remove windowSize deps
    const {width: windowWidth, height: windowHeight } = useWindowSize()
    useEffect(() => {
        setWidth(dayRef.current!.clientWidth)
        setHeight(dayRef.current!.offsetHeight)
        setLeftOffset(dayRef.current!.offsetLeft)
    }, [windowWidth, windowHeight])
    
    const hourMarkers = []
    const steps = timeRangeEnd - timeRangeStart
    const currentTimeOffset = day ? getTopOffset(new Date(), addHours(startOfDay(day), timeRangeStart), steps) : null
    for(let i = timeRangeStart; i < timeRangeEnd; i++) {
        if(day){
        const timeAndDate = addHours(day, i)
        hourMarkers.push(
            <HourMarker key={timeAndDate.toString()} timeAndDate={timeAndDate} />
        )
        }
    }
  
    return (
    <>

        <div className={`relative grid grid-cols-1 grid-rows-[${timeRangeEnd - timeRangeStart}] ${state.today && state.display != "one" && day && isSameDay(day, state.today) ? 'bg-slate-50' : ''} border-l last:border-r`} ref={dayRef}>
        {
                state.today && day && isSameDay(day, state.today) && currentTimeOffset != null && isBefore(new Date(), addHours(startOfDay(day), timeRangeEnd)) &&
                <span className={`content-none z-10 h-[1px] absolute bg-red-500`} style={{top: `${currentTimeOffset}%`, width: width + 1}}>
                    <div className='h-4 w-4 rounded-full bg-red-500 absolute -left-2 -top-2'/>
                </span>
            }

            {
                hourMarkers.map((e) => {
                    return e
                })
            }
            <span className='content-none h-[1px] absolute bottom-0 bg-gray-200 w-full'></span>
            {   height != 0 &&
                tasks.map((task) => {
                    return <Event key={task.id} tagId={task.tag ? task.tagId : null} tagColorValue={task.tag ? task.tag.colorHexValue: null} tagName={task.tag ? task.tag.name : null}  taskId={task.id} taskTitle={task.title} taskStart={task.timeStart} taskEnd={task.timeEnd} steps={steps} startHour={timeRangeStart} parentHeight={height} colIdx={colIdx}/>
                })
            }
        </div>
    </>
  )
}

export default Day