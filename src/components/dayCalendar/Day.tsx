import { Task } from '@prisma/client'
import { addHours } from 'date-fns';
import React, { useEffect, useRef, useState } from 'react'
import CreateModal from './CreateModal';
import { DayEvent } from './Event';
import HourMarker from './HourMarker';

const Day = ({tasks, timeRangeStart, timeRangeEnd, day}: {tasks: Task[], timeRangeStart: number, timeRangeEnd: number, day: Date | undefined}) => {
    const [height, setHeight] = useState<number>(0)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [createModalTimeAndDate, setCreateModalTimeAndDate] = useState<Date>(new Date)
    const dayRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setHeight(dayRef.current!.offsetHeight)
    }, [])
    
    const hourMarkers = []
    const steps = timeRangeEnd - timeRangeStart
    for(let i = timeRangeStart; i < timeRangeEnd; i++) {
        if(day){
        const timeAndDate = addHours(day, i)
        hourMarkers.push(
            //TODO: modal onclick w/ metadata for day/time
            <HourMarker key={timeAndDate.toString()} timeAndDate={timeAndDate} setCreateModalTimeAndDate={setCreateModalTimeAndDate} setIsCreateModalOpen={setIsCreateModalOpen}/>
        )
        }
    }
  
    return (
    <>
        <div className={`relative grid grid-cols-1 grid-rows-[${timeRangeEnd - timeRangeStart}] border-l last:border-r`} ref={dayRef}>
            {
                hourMarkers.map((e) => {
                    return e
                })
            }
            <span className='content-none h-[1px] absolute bottom-0 bg-gray-200 w-full'></span>
            {   dayRef.current != null && dayRef &&
                tasks.map((task) => {
                    return <DayEvent taskId={task.id} taskTitle={task.title} taskStart={task.timeStart} taskEnd={task.timeEnd} steps={steps} startHour={timeRangeStart} parentHeight={height}/>
                })
            }
        </div>
        {/* <CreateModal timeAndDate={createModalTimeAndDate} isOpen={isCreateModalOpen} setIsOpen={setIsCreateModalOpen} timeRangeEnd={timeRangeEnd} timeRangeStart={timeRangeStart}/> */}

    </>
  )
}

export default Day