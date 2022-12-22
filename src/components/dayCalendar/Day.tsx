import { Task } from '@prisma/client'
import { addHours, isSameDay } from 'date-fns';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { CalendarContext } from '../../context/CalendarContext';
import CreateModal from './CreateModal';
import { Event } from './Event';
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
    useEffect(() => {
        setWidth(dayRef.current!.clientWidth)
        setHeight(dayRef.current!.offsetHeight)
        setLeftOffset(dayRef.current!.offsetLeft)
    }, [])
    
    const hourMarkers = []
    const steps = timeRangeEnd - timeRangeStart
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