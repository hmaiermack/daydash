import React, { useMemo, useState } from 'react'
import { getCoreRowModel, flexRender, createColumnHelper, useReactTable } from '@tanstack/react-table'
import { addDays, addHours, eachDayOfInterval, endOfDay, format, isSameHour, nextSaturday, previousSunday, startOfDay } from 'date-fns'
import { trpc } from '../../utils/trpc'
import { Tag, Task } from '@prisma/client'
 

//each time has associated tasks that may or may not happen on a given day
// time: 8:00 AM, sunday: {TASK metadata}, monday: undefined, ... saturday: {TASK metadata}
type TimeRow = {
  time: string,
  sunday?: {
    taskId: string,
    taskTitle: string,
    taskStart: Date,
    taskEnd: Date,
    tagId?: string,
    tagColorValue?: string,
    tagName?: string,
  },
  monday?: {
    taskId: string,
    taskTitle: string,
    taskStart: Date,
    taskEnd: Date,
    tagId?: string,
    tagColorValue?: string,
    tagName?: string,
  },
  tuesday?: {
    taskId: string,
    taskTitle: string,
    taskStart: Date,
    taskEnd: Date,
    tagId?: string,
    tagColorValue?: string,
    tagName?: string,
  },
  wednesday?: {
    taskId: string,
    taskTitle: string,
    taskStart: Date,
    taskEnd: Date,
    tagId?: string,
    tagColorValue?: string,
    tagName?: string,
  },
  thursday?: {
    taskId: string,
    taskTitle: string,
    taskStart: Date,
    taskEnd: Date,
    tagId?: string,
    tagColorValue?: string,
    tagName?: string,
  },
  friday?: {
    taskId: string,
    taskTitle: string,
    taskStart: Date,
    taskEnd: Date,
    tagId?: string,
    tagColorValue?: string,
    tagName?: string,
  },
  saturday?: {
    taskId: string,
    taskTitle: string,
    taskStart: Date,
    taskEnd: Date,
    tagId?: string,
    tagColorValue?: string,
    tagName?: string,
  },
}

const columnHelper = createColumnHelper<TimeRow>()

const columns = [
  columnHelper.accessor('time', {
    header: () => '',
    cell: info => (<span className='text-gray-500 p-2'>{info.getValue()}</span>)
  }),
  columnHelper.accessor(row => row.sunday, {
    header: () => 'Sunday',
    id: 'Sunday',
    cell: info => {
      const day = info.getValue()

      if(!day) return (
        <div className='h-20 w-40'></div>
      )

      return (
        <div className='flex flex-col h-20 w-40 justify-center ml-4 p-4 min-w-20'>          
          <span>{day.taskId}</span>
          <span className=''>{day.taskTitle}</span>
        </div>
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
        <div className='h-20 w-40'></div>
      )

      return (
        <div className='flex flex-col h-20 w-40 justify-center ml-4 p-4 min-w-20'>          
          <span>{day.taskId}</span>
          <span className=''>{day.taskTitle}</span>
        </div>
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
        <div className='h-20 w-40'></div>
      )

      return (
        <div className='flex flex-col h-20 w-40 justify-center ml-4 p-4 min-w-20'>          
          <span>{day.taskId}</span>
          <span className=''>{day.taskTitle}</span>
        </div>
      )
    },
    enableHiding: true,
  }),
  columnHelper.accessor(row => row.wednesday, {
    header: () => 'Wednesday',
    id: 'Wednesday',
    cell: info => {
      const day = info.getValue()
      
      if(!day) return ''
      
      return (
        <div className='flex flex-col h-20 w-40 justify-center ml-4 p-4 min-w-20'>          
          <span>{day.taskId}</span>
          <span className=''>{day.taskTitle}</span>
        </div>
      )
    },
    enableHiding: true,
  }),
  columnHelper.accessor(row => row.thursday, {
    header: () => 'Thursday',
    id: 'Thursday',
    cell: info => {
      const day = info.getValue()
      
      if(!day) return (
        <div className='h-20 w-40'></div>
      )

      return (
        <div className='flex flex-col h-20 w-40 justify-center ml-4 p-4 min-w-20'>          
          <span>{day.taskId}</span>
          <span className=''>{day.taskTitle}</span>
        </div>
      )
    },
    enableHiding: true,
  }),
  columnHelper.accessor(row => row.friday, {
    header: () => 'Friday',
    id: 'Friday',
    cell: info => {
      const day = info.getValue()

      if(!day) return (
        <div className='h-20 w-40 bg-slate-400 translate-y-0.5 absolute'></div>
      )

      return (
        <div className='flex flex-col h-20 w-40 justify-center ml-4 p-4 min-w-20'>          
          <span>{day.taskId}</span>
          <span className=''>{day.taskTitle}</span>
        </div>
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
        <div className='h-20 w-40'></div>
      )

      return (
        <div className='flex flex-col h-20 w-40 justify-center ml-4 p-4'>          
          <span>{day.taskId}</span>
          <span className=''>{day.taskTitle}</span>
        </div>
      )
    },
    enableHiding: true,
  }),
]
export const Table = ({screenWidth}: { screenWidth: number}) => {
  const [date, setDate] = useState(new Date)
  const weekStart = startOfDay(previousSunday(date))
  const weekEnd = endOfDay(nextSaturday(date))
  const { isLoading, isError, data: taskData, error } = trpc.useQuery(["tasks.tasks", {date}]);  

//needs to be persisted via db
const userRange = [8, 16] as const

const tableRows: TimeRow[] = []
const [data, setData] = useState(() => [...tableRows])


useMemo(() => {
  if(taskData) {
    const days = eachDayOfInterval({
        start: weekStart,
        end: weekEnd
    })
    let day = weekStart
    //this is nasty
    //probably should just get userInfo from api and make it available to whole app
    //alternatively could pass it thru tasks.task as an object {timeStart, timeEnd, tasks: [...]}?
    const userRange = [taskData[0] ? taskData[0].user.timeRangeStart : 9, taskData[0] ? taskData[0].user.timeRangeEnd : 17] as const
    for(let i = userRange[0]; i < userRange[1]; i++) {
        const tempRowObject: {[key:string]: any, time: string} = { time: ''}
        const hourString = addHours(day, i)
        days.forEach(day => {
            const hour = addHours(day, i)
            let temp: undefined | (Task & {tag: Tag | null})
            taskData.forEach(task => {if(isSameHour(task.timeStart, hour)){temp = task}})
            //below should be working, don;t know why it isnt
            // const task = taskData.find(task => {
            //     isSameHour(task.timeStart, hour)
            // })
            if(temp !== undefined) {
                tempRowObject[format(day, "EEEE").toLowerCase()] = {
                  taskId: temp.id,
                  taskTitle: temp.title,
                  taskStart: temp.timeStart,
                  taskEnd: temp.timeEnd,
                  tagId: temp.tagId ? temp.tagId : undefined,
                  tagColorValue: temp.tag?.colorHexValue ? temp.tag?.colorHexValue : undefined,
                  tagName: temp.tag?.name ? temp.tag?.name : undefined           
                }
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
    data, columns, getCoreRowModel: getCoreRowModel()
  })
  return (
    
    <table>
    <thead className=''>
        { table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
                { headerGroup.headers.map(header => (
                    <th key={header.id}>
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
        <tr key={row.id} className='divide-y divide-y-blue-300 -translate-y-11 '>
          {row.getVisibleCells().map(cell => (
            <td key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
       ))}
    </tbody>
</table>

  )
}
