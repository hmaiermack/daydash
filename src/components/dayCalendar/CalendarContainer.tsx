import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { startOfDay, endOfDay, addHours, eachDayOfInterval, format, isSameDay, eachHourOfInterval, subDays } from 'date-fns'
import { trpc } from '../../utils/trpc'
import { Task } from '@prisma/client'
import Day from './Day'
import CreateModal from './CreateModal'
import { CreateModalContext } from '../../context/CreateModalContext'
import { CalendarContext } from '../../context/CalendarContext'
import { EditModalContext } from '../../context/EditModalContext'
import EditModal from './EditModal'
import CalendarToolbar from './CalendarToolbar'
import DaysBanner from './DaysBanner'
import TimeColumn from './TimeColumn'
import useCreateColumns from '../../hooks/useCreateColumns'

//TODO: break this up into smaller components
//TODO: render a skeleton calendar while loading to prevent flicker

const CalendarContainer = () => {
    const {state: CreateModalState } = React.useContext(CreateModalContext)
    const { state: CalendarState, dispatch } = React.useContext(CalendarContext)
    const { state: EditModalState } = React.useContext(EditModalContext)
    const [selectedDisplay, setSelectedDisplay] = React.useState(CalendarState.display)

    const { isLoading, isError, data: taskData, error } = trpc.useQuery(["tasks.tasks", {startDate: CalendarState.dateRangeStart, endDate: CalendarState.dateRangeEnd}]);  


    
    const {columns, hours, lastHour, days} = useCreateColumns(taskData)

    const [template, setTemplate] = useState("80px 1fr 1fr 1fr 1fr 1fr 1fr 1fr")

    useLayoutEffect(() => {
        switch(CalendarState.display) {
            case "week":
                setTemplate("80px 1fr 1fr 1fr 1fr 1fr 1fr 1fr")
                break;
            case "one":
                setTemplate("80px 1fr")
                break;
            case "three":
                setTemplate("80px 1fr 1fr 1fr")
                break;
        }
    }, [CalendarState.display])



  return (
    <>
        <CalendarToolbar selectedDisplay={selectedDisplay} setSelectedDisplay={setSelectedDisplay} tags={taskData?.tags}/>
        <div className='h-[500px] overflow-y-auto'>
            <div className='grid min-h-[700px] px-8 pb-8 overflow-x-auto overflow-y-hidden' style={{gridTemplateColumns: template, gridTemplateRows: "48px 1fr"}}>
                <div></div>
                    {days.map((day) => {
                        return (
                            <DaysBanner day={day} key={day.toISOString()} setSelectedDisplay={setSelectedDisplay} />
                        )
                    })}
                    {taskData &&
                        <TimeColumn hours={hours} lastHour={lastHour} timeRangeEnd={taskData.timeRangeEnd} timeRangeStart={taskData.timeRangeStart} />    
                    }
                    {   taskData &&
                        columns.map((col, idx) => {
                            return (
                                <Day tasks={col} day={days[idx]} colIdx={idx} timeRangeStart={taskData?.timeRangeStart} timeRangeEnd={taskData?.timeRangeEnd} key={idx} />
                                )
                        })
                    }

                    {
                        CreateModalState.selectedTime && taskData && <CreateModal selectedTime={CreateModalState.selectedTime} timeRangeStart={taskData?.timeRangeStart} timeRangeEnd={taskData?.timeRangeEnd} tasks={taskData.tasks} tags={taskData.tags}/>
                    }
                    {
                        EditModalState.isEditModalOpen && taskData && <EditModal timeRangeStart={taskData?.timeRangeStart} timeRangeEnd={taskData?.timeRangeEnd} tasks={taskData.tasks} tags={taskData.tags}/>
                    }
            </div>

        </div>
     </>
  )
}

export default CalendarContainer