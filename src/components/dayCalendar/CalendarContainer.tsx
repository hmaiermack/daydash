import React, { useLayoutEffect, useMemo, useState } from 'react'
import { trpc } from '../../utils/trpc'
import Day from './Day'
import CreateModal from './CreateModal'
import { CreateModalContext } from '../../context/CreateModalContext'
import { CalendarContext } from '../../context/CalendarContext'
import { EditModalContext } from '../../context/EditModalContext'
import EditModal from './EditModal'
import CalendarToolbar from './toolbar/CalendarToolbar'
import DaysBanner from './DaysBanner'
import TimeColumn from './TimeColumn'
import useCreateColumns from '../../hooks/useCreateColumns'
import { addHours, eachDayOfInterval, eachHourOfInterval, format } from 'date-fns'

const CalendarContainer = () => {
    const {state: CreateModalState } = React.useContext(CreateModalContext)
    const { state: CalendarState, dispatch } = React.useContext(CalendarContext)
    const { state: EditModalState } = React.useContext(EditModalContext)
    const [selectedDisplay, setSelectedDisplay] = React.useState(CalendarState.display)
    const [hours, setHours] = useState<Date[]>([])
    const [placeholders, setPlaceholders] = useState<number[]>([9, 17])

    const { isLoading, isError, data: taskData, error } = trpc.useQuery(["tasks.tasks", {startDate: CalendarState.dateRangeStart, endDate: CalendarState.dateRangeEnd}]);  
    
    const days: Date[] = eachDayOfInterval({
        start: CalendarState.dateRangeStart,
        end: CalendarState.dateRangeEnd
      })


    useMemo(() => {
        if (taskData?.timeRangeStart && taskData.timeRangeEnd) {
            setHours(eachHourOfInterval({start: addHours(CalendarState.dateRangeStart, taskData?.timeRangeStart), end: addHours(CalendarState.dateRangeStart, taskData?.timeRangeEnd - 1)}))
            setPlaceholders([taskData.timeRangeStart, taskData.timeRangeEnd])
        }
    }, [taskData?.timeRangeStart, taskData?.timeRangeEnd])

    const lastHour = hours[hours.length - 1]

  
    const { columns } = useCreateColumns(taskData, days)
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
                    {
                        <TimeColumn hours={hours} lastHour={lastHour} timeRangeEnd={taskData?.timeRangeEnd} timeRangeStart={taskData?.timeRangeStart} />    
                    }
                    {   taskData ?
                        columns.map((col, idx) => {
                            return (
                                <Day tasks={col} day={days[idx]} colIdx={idx} timeRangeStart={taskData?.timeRangeStart} timeRangeEnd={taskData?.timeRangeEnd} key={idx} />
                                )
                        }) :
                        columns.map((_, idx) => {
                            return (
                                <Day tasks={[]} day={days[idx]} colIdx={idx} key={idx} timeRangeStart={placeholders[0] ? placeholders[0] : 9} timeRangeEnd={placeholders[1] ? placeholders[1] : 17}/>
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