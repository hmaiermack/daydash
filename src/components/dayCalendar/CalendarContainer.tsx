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

//TODO: break this up into smaller components
//TODO: render a skeleton calendar while loading to prevent flicker

const CalendarContainer = () => {
    const {state: CreateModalState } = React.useContext(CreateModalContext)
    const { state: CalendarState, dispatch } = React.useContext(CalendarContext)
    const { state: EditModalState } = React.useContext(EditModalContext)
    const [selectedDisplay, setSelectedDisplay] = React.useState(CalendarState.display)


    
    const { isLoading, isError, data: taskData, error } = trpc.useQuery(["tasks.tasks", {startDate: CalendarState.dateRangeStart, endDate: CalendarState.dateRangeEnd}]);  

    const cols: (Task & {
        tag: {
            name: string;
            colorHexValue: string;
        } | null;
    })[][] = []
    const [data, setData] = useState(() => [...cols])
    
    const days: Date[] = eachDayOfInterval({
      start: CalendarState.dateRangeStart,
      end: CalendarState.dateRangeEnd
    })
  let hours: Date[] = []
  if(taskData) {
    hours = eachHourOfInterval({start: addHours(CalendarState.dateRangeStart, taskData?.timeRangeStart), end: addHours(CalendarState.dateRangeStart, taskData?.timeRangeEnd - 1)})
  }
    useEffect(() => {
        if(taskData?.tasks != undefined) {
            //this is nasty
            //probably should just get userInfo from api and make it available to whole app
            //alternatively could pass it thru tasks.task as an object {timeStart, timeEnd, tasks: [...]}?
                let taskArr = taskData.tasks
                days.forEach((day, idx) => {
                    let temp: (Task & {
                        tag: {
                            name: string;
                            colorHexValue: string;
                        } | null;
                    })[] = []
                    taskArr.forEach((task, index) => {
                        if(isSameDay(task!.timeStart, day) && task) {
                            temp = [...temp, task]
                        }
                    })
                    cols[idx] = temp
                })
            setData([...cols])
          }
          //eslint-disable-next-line
    }, [taskData, CalendarState.display])

    const lastHour = hours[hours.length - 1]

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
        <div className='grid min-h-[700px] px-8 overflow-x-auto' style={{gridTemplateColumns: template, gridTemplateRows: "48px 1fr"}}>
            <div></div>
                {days.map((day) => {
                    return (
                        <div key={day.toDateString()} className={`${CalendarState.today && isSameDay(day, CalendarState.today) ? 'bg-blue-200' : ''} flex p-3 flex-col justify-center items-center hover:bg-slate-50 hover:cursor-pointer`} onClick={() => {
                            dispatch({type: 'changeDisplay', payload: {
                                display: 'one',
                                dateRangeStart: startOfDay(day),
                                dateRangeEnd: endOfDay(day)
                            }})
                            setSelectedDisplay('one')
                        }}>
                            <div>{format(day, "eeee")}</div>
                            <div>{format(day, "d")}</div>
                        </div>
                    )
                })}
                {taskData && 
                    <div className={`grid relative grid-cols-1 grid-rows-[${taskData?.timeRangeEnd - taskData?.timeRangeStart}]`}>
                        {hours && 
                            hours.map((hour, idx) => {
                                return (
                                    <div key={`${hour.toDateString()} ${idx}`} className='relative'>
                                        <div className='text-gray-500 text-sm absolute top-[-11px]'>{format(hour, "h:mm aa")}</div>
                                        <span className='content-none h-[1px] absolute top-0 bg-gray-200 w-4 left-[85%] '></span>
                                    </div>
                                )
                            })    
                        }
                        {lastHour &&
                            <span className='text-gray-500 text-sm absolute bottom-[-9px]'>
                                {
                                    format(addHours(lastHour, 1), "h:mm aa")
                                }
                            </span>
                        }
                        <span className='content-none h-[1px] absolute bottom-0 bg-gray-200 w-4 left-[85%] '></span>
                    </div>        
                }

                {   taskData && days.length > 0 &&
                    data.map((col, idx) => {
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
     </>
  )
}

export default CalendarContainer