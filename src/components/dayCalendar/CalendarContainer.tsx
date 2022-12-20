import React, { useMemo, useState } from 'react'
import { addDays, addHours, eachDayOfInterval, format, isSameDay, eachHourOfInterval, subDays } from 'date-fns'
import { trpc } from '../../utils/trpc'
import { Task } from '@prisma/client'
import Day from './Day'
import CreateModal from './CreateModal'
import { CreateModalContext, CreateModalContextType } from '../../context/modalContext'
import { CalendarContext } from '../../context/CalendarContext'


const CalendarContainer = () => {
    const {selectedTime} = React.useContext(CreateModalContext) as CreateModalContextType
    const { state: CalendarState, dispatch } = React.useContext(CalendarContext)


    
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
    useMemo(() => {
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
    }, [taskData])

    const lastHour = hours[hours.length - 1]

    const handleMoveTimeForward = () => {
        switch (CalendarState.display) {
            case 'week':
                dispatch({
                    type: 'moveTimeForward',
                    payload: {
                        dateRangeStart: addDays(CalendarState.dateRangeStart, 7),
                        dateRangeEnd: addDays(CalendarState.dateRangeEnd, 7),
                    }
                });
                break;
            case 'one':
                dispatch({
                    type: 'moveTimeForward',
                    payload: {
                        dateRangeStart: addDays(CalendarState.dateRangeStart, 1),
                        dateRangeEnd: addDays(CalendarState.dateRangeEnd, 1),
                    }
                });
                break;
            case 'three':
                dispatch({
                    type: 'moveTimeForward',
                    payload: {
                        dateRangeStart: addDays(CalendarState.dateRangeStart, 3),
                        dateRangeEnd: addDays(CalendarState.dateRangeEnd, 3),
                    }
                });
                break;
            }
        }

const handleMoveTimeBackward = () => {
    switch (CalendarState.display) {
        case 'week':
            dispatch({
                type: 'moveTimeBackward',
                payload: {
                    dateRangeStart: subDays(CalendarState.dateRangeStart, 7),
                    dateRangeEnd: subDays(CalendarState.dateRangeEnd, 7),
                }
            });
            break;
        case 'one':
            dispatch({
                type: 'moveTimeBackward',
                payload: {
                    dateRangeStart: subDays(CalendarState.dateRangeStart, 1),
                    dateRangeEnd: subDays(CalendarState.dateRangeEnd, 1),
                }
            });
            break;
        case 'three':
            dispatch({
                type: 'moveTimeBackward',
                payload: {
                    dateRangeStart: subDays(CalendarState.dateRangeStart, 3),
                    dateRangeEnd: subDays(CalendarState.dateRangeEnd, 3),
                }
            });
        }
        

    }


  return (
    <>
        <button className='bg-blue-200 p-4 mr-4' onClick={handleMoveTimeForward}>next week</button>
        <button className='bg-blue-200 p-4 mr-4' onClick={handleMoveTimeBackward}>last week</button>
        <div className='grid min-h-[700px]' style={{gridTemplateColumns: "80px 1fr 1fr 1fr 1fr 1fr 1fr 1fr", gridTemplateRows: "48px 1fr"}}>
            <div></div>
                {days.map((day) => {
                    return (
                        <div key={day.toDateString()}>{format(day, "eeee d")}</div>
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
                    selectedTime && taskData && <CreateModal selectedTime={selectedTime} timeRangeStart={taskData?.timeRangeStart} timeRangeEnd={taskData?.timeRangeEnd} tasks={taskData.tasks} tags={taskData.tags}/>
                }
        </div>
     </>
  )
}

export default CalendarContainer