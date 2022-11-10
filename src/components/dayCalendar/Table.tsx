import React, { useMemo, useState } from 'react'
import { getCoreRowModel, flexRender, createColumnHelper, useReactTable } from '@tanstack/react-table'
import { addDays, addHours, eachDayOfInterval, endOfDay, format, isSameHour, nextSaturday, previousSunday, startOfDay, isSameDay } from 'date-fns'
import { trpc } from '../../utils/trpc'
import { Tag, Task } from '@prisma/client'
import { EmptyDay } from './EmptyDay'
import { DayEvent } from './DayEvent'
import EventContainer from './EventContainer'
 

//each time has associated tasks that may or may not happen on a given day
// time: 8:00 AM, sunday: [{TASK metadata}], monday: undefined, ... saturday: [{TASK metadata}]
type TimeRow = {
  time: string,
  sunday: {
    taskId: string,
    title: string,
    start: Date,
    end: Date,
    tagId?: string,
    tagColorValue?: string,
    tagName?: string,
  }[],
  monday: {
    taskId: string,
    title: string,
    start: Date,
    end: Date,
    tagId?: string,
    tagColorValue?: string,
    tagName?: string,
  }[],
  tuesday: {
    taskId: string,
    title: string,
    start: Date,
    end: Date,
    tagId?: string,
    tagColorValue?: string,
    tagName?: string,
  }[],
  wednesday: {
    taskId: string,
    title: string,
    start: Date,
    end: Date,
    tagId?: string,
    tagColorValue?: string,
    tagName?: string,
  }[],
  thursday: {
    taskId: string,
    title: string,
    start: Date,
    end: Date,
    tagId?: string,
    tagColorValue?: string,
    tagName?: string,
  }[],
  friday: {
    taskId: string,
    title: string,
    start: Date,
    end: Date,
    tagId?: string,
    tagColorValue?: string,
    tagName?: string,
  }[],
  saturday: {
    taskId: string,
    title: string,
    start: Date,
    end: Date,
    tagId?: string,
    tagColorValue?: string,
    tagName?: string,
  }[],
}

const columnHelper = createColumnHelper<TimeRow>()

export const Table = ({screenWidth}: { screenWidth: number}) => {
  const columns = [
    columnHelper.accessor('time', {
      header: () => '',
      cell: info => (<span className='text-gray-500 p-2 divide-y divide-y-blue-300'>{info.getValue()}</span>)
    }),
    columnHelper.accessor(row => row.sunday, {
      header: () => 'Sunday',
      id: 'Sunday',
      cell: info => {
        const day = info.getValue()
  
        if(!day) return (
          <EmptyDay screenWidth={screenWidth} />
        )
  
        return (
          day.map((day) => {
            <DayEvent 
              taskId={day.taskId} 
              taskTitle={day.title} 
              taskStart={day.start}
              taskEnd={day.end}
              tagId={day.tagId}
              tagColorValue={day.tagColorValue}
              tagName={day.tagName}/>
          })
        )
      },
      enableHiding: true,
    }),
    columnHelper.accessor(row => row.monday, {
      header: () => 'Monday',
      id: 'Monday',
      cell: info => {
        const day = info.getValue()
  
        if(!day) return (
          <EmptyDay screenWidth={screenWidth} />
        )
  
        return (
          day.map((day) => {
            <DayEvent 
              taskId={day.taskId} 
              taskTitle={day.title} 
              taskStart={day.start}
              taskEnd={day.end}
              tagId={day.tagId}
              tagColorValue={day.tagColorValue}
              tagName={day.tagName}/>
          })
        )
      },
      enableHiding: true,
    }),
    columnHelper.accessor(row => row.tuesday, {
      header: () => 'Tuesday',
      id: 'Tuesday',
      cell: info => {
        const day = info.getValue()
  
        if(!day) return (
          <EmptyDay screenWidth={screenWidth} />
        )
  
        return (
          day.map((day) => {
            <DayEvent 
              taskId={day.taskId} 
              taskTitle={day.title} 
              taskStart={day.start}
              taskEnd={day.end}
              tagId={day.tagId}
              tagColorValue={day.tagColorValue}
              tagName={day.tagName}/>
          })
        )
      },
      enableHiding: true,
    }),
    columnHelper.accessor(row => row.wednesday, {
      header: () => 'Wednesday',
      id: 'Wednesday',
      cell: info => {
        const day = info.getValue()
        
        if(!day) return (
          <EmptyDay screenWidth={screenWidth} />
        )
        
        return (
          day.map((day) => {
            <DayEvent 
              taskId={day.taskId} 
              taskTitle={day.title} 
              taskStart={day.start}
              taskEnd={day.end}
              tagId={day.tagId}
              tagColorValue={day.tagColorValue}
              tagName={day.tagName}/>
          })
        )
      },
      enableHiding: true,
    }),
    columnHelper.accessor(row => row.thursday, {
      header: () => 'Thursday',
      id: 'Thursday',
      cell: info => {
        const tasks = info.getValue()
        console.log({tasks, length: tasks.length})
        if(tasks?.length === 0) return (
          <EmptyDay screenWidth={screenWidth} />
          )

        if(tasks?.length && tasks?.length === 1) {
          return (
            <>
            {tasks[0] &&
              <DayEvent 
              taskId={tasks[0].taskId} 
              taskTitle={tasks[0].title} 
              taskStart={tasks[0].start}
              taskEnd={tasks[0].end}
              tagId={tasks[0].tagId}
              tagColorValue={tasks[0].tagColorValue}
              tagName={tasks[0].tagName}/>
            
            }
            </>
          )
        }
          
          if(tasks?.length > 1){
            console.log("in task length > 1")
            return (
              <>
                  {tasks &&
                  <>
                  {tasks.map((task) => {
                    return (
                      <DayEvent 
                         taskId={task.taskId} 
                         taskTitle={task.title} 
                         taskStart={task.start}
                         taskEnd={task.end}
                         tagId={task.tagId}
                         tagColorValue={task.tagColorValue}
                         tagName={task.tagName}/>
                    )

                  })}
                    </>
                  }

                {/* {tasks!.length > 0 && tasks?.map((task) => {
                  console.log("now inside tasks map for day event")
                  //  <DayEvent 
                  //    taskId={task.taskId} 
                  //    taskTitle={task.title} 
                  //    taskStart={task.start}
                  //    taskEnd={task.end}
                  //    tagId={task.tagId}
                  //    tagColorValue={task.tagColorValue}
                  //    tagName={task.tagName}/>
                })} */}
              </>
            )    
          }
      },
      enableHiding: true,
    }),
    columnHelper.accessor(row => row.friday, {
      header: () => 'Friday',
      id: 'Friday',
      cell: info => {
        const day = info.getValue()
  
        if(!day) return (
          <EmptyDay screenWidth={screenWidth} />
        )
  
        return (
          day.map((day) => {
            <DayEvent 
              taskId={day.taskId} 
              taskTitle={day.title} 
              taskStart={day.start}
              taskEnd={day.end}
              tagId={day.tagId}
              tagColorValue={day.tagColorValue}
              tagName={day.tagName}/>
          })
        )
      },
      enableHiding: true,
    }),
    columnHelper.accessor(row => row.saturday, {
      header: () => 'Saturday',
      id: 'Saturday',
      cell: info => {
        const day = info.getValue()
  
        if(!day) return (
          <EmptyDay screenWidth={screenWidth} />
        )
  
        return (
          day.map((day) => {
            <DayEvent 
              taskId={day.taskId} 
              taskTitle={day.title} 
              taskStart={day.start}
              taskEnd={day.end}
              tagId={day.tagId}
              tagColorValue={day.tagColorValue}
              tagName={day.tagName}/>
          })
        )
      },
      enableHiding: true,
    }),
  ]
 
  const [date, setDate] = useState(new Date)
  const weekStart = startOfDay(previousSunday(date))
  const weekEnd = endOfDay(nextSaturday(date))
  const { isLoading, isError, data: taskData, error } = trpc.useQuery(["tasks.tasks", {date}]);  

//needs to be persisted via db
const userRange = [8, 16] as const

const tableRows: TimeRow[] = []
const [data, setData] = useState(() => [...tableRows])
useMemo(() => {
  if(taskData != undefined) {
    const days = eachDayOfInterval({
        start: weekStart,
        end: weekEnd
    })
    let day = weekStart
    //this is nasty
    //probably should just get userInfo from api and make it available to whole app
    //alternatively could pass it thru tasks.task as an object {timeStart, timeEnd, tasks: [...]}?
    const userRange = [taskData!.timeRangeStart, taskData!.timeRangeEnd] as const
    for(let i = userRange[0]; i < userRange[1]; i++) {
        // const tempRowObject: { 
        //   'sunday'?: any,
        //   'monday'?: any,
        //   'tuesday'?: any,
        //   'wednesday'?: any,
        //   'thursday'?: any,
        //   'friday'?: any,
        //   'saturday'?: any,
        //   time: string
        //  } = { time: ''}
        const tempRowObject: any = {time: ''}
        const hourString = addHours(day, i)
        days.forEach(day => {
            const hour = addHours(day, i)
            let temp: (Task & {tag: Tag | null})[] = []
            if(!taskData.tasks) return
            taskData.tasks.forEach(task => {
              if(task.start && isSameHour(task!.start, hour)){
              temp!.push(task)
              }
            })
            //below should be working, don;t know why it isnt
            // const task = taskData.find(task => {
            //     isSameHour(task.timeStart, hour)
            // })
            if(temp !== undefined) {
                tempRowObject[format(day, "EEEE").toLowerCase()] = temp
            } else {
                tempRowObject[format(day, "EEEE")] = undefined
            }
        })
        tempRowObject.time = format(hourString, "h:mm aa")
        tableRows.push(tempRowObject)
        day = addDays(day, 1)
    }
    setData([...tableRows])
  }  
}, [taskData])

  const table = useReactTable({
    data, columns, getCoreRowModel: getCoreRowModel(), initialState: { columnVisibility: { Sunday: false, Monday: false, Tuesday: false, Wednesday: false, Friday: false, Saturday: false}}
  })
  return (
    
    <table>
    <thead className='translate-y-4 text-lg font-semibold text-gray-800'>
        { table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
                { headerGroup.headers.map(header => (
                    <th key={header.id} className='w-52'>
                      {
                        header.isPlaceholder 
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                      }
                    </th>
                    ))
                }
            </tr>
        ))
        }
    </thead>
    <tbody className=''>
      <tr className='h-10'></tr>
       {table.getRowModel().rows.map(row => (
        <tr key={row.id} className='divide-y divide-y-blue-300 -translate-y-11 h-20 max-h-20'>
          {row.getVisibleCells().map(cell => (
            <td key={cell.id} className='mx-auto border-x p-0 border-t-0'>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
          <span className='w-full h-[1px] bg-red-600 absolute -translate-y-12 left-0'>f</span>
        </tr>
       ))}
    </tbody>
</table>

  )
}
