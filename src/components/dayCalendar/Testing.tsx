import React, { useMemo, useRef, useState } from 'react'
import { addDays, addHours, eachDayOfInterval, endOfDay, format, isSaturday, nextSaturday, previousSunday, startOfDay, isSameDay, eachHourOfInterval, isSunday } from 'date-fns'
import { trpc } from '../../utils/trpc'
import { Tag, Task } from '@prisma/client'
import Day from './Day'
import CreateModal from './CreateModal'
import { CreateModalContext, CreateModalContextType } from '../../context/modalContext'


const Testing = () => {
    const {selectedTime} = React.useContext(CreateModalContext) as CreateModalContextType

      const [date, setDate] = useState(new Date)
      const weekStart = isSunday(date)? startOfDay(date) : startOfDay(previousSunday(date))
      const weekEnd = isSaturday(date) ? endOfDay(date) : endOfDay(nextSaturday(date))        
    
    const { isLoading, isError, data: taskData, error } = trpc.useQuery(["tasks.tasks", {date}]);  

    // task object has an optional tag property
    const cols: (Task & {
        tag: {
            name: string;
            colorHexValue: string;
        } | null;
    })[][] = []
    const [data, setData] = useState(() => [...cols])
    
    const days: Date[] = eachDayOfInterval({
      start: weekStart,
      end: weekEnd
    })
  let hours: Date[] = []
  if(taskData) {
    hours = eachHourOfInterval({start: addHours(weekStart, taskData?.timeRangeStart), end: addHours(weekStart, taskData?.timeRangeEnd - 1)})
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
    }, [taskData])

    const lastHour = hours[hours.length - 1]

  return (
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
                        <Day tasks={col} day={days[idx]} timeRangeStart={taskData?.timeRangeStart} timeRangeEnd={taskData?.timeRangeEnd} key={idx} />
                    )
                })
            }
            {
               selectedTime && taskData && taskData.timeRangeStart && taskData.timeRangeEnd && <CreateModal selectedTime={selectedTime} timeRangeStart={taskData?.timeRangeStart} timeRangeEnd={taskData?.timeRangeEnd} tasks={taskData.tasks} tags={taskData.tags}/>
            }
     </div>
  )
}

export default Testing