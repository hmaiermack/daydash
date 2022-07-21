import React, { useMemo, useState } from 'react'
import { createColumn, getCoreRowModel, flexRender, createColumnHelper, useReactTable } from '@tanstack/react-table'
import { addDays, addHours, eachDayOfInterval, endOfDay, format, isSameHour, nextSaturday, previousSunday, startOfDay } from 'date-fns'
import { trpc } from '../../utils/trpc'
import { Tag, Task } from '@prisma/client'


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
    cell: info => info.getValue()
  }),
  columnHelper.accessor(row => row.sunday, {
    header: () => 'Sunday',
    id: 'Sunday',
    cell: info => {
      const day = info.getValue()

      if(!day) return ''

      return (
        <div className='flex flex-col'>          
          <span>{day.taskId}</span>
          <span>{day.taskTitle}</span>
        </div>
      )
    }
  }),
  columnHelper.accessor(row => row.monday, {
    header: () => 'Monday',
    id: 'Monday',
    cell: info => {
      const day = info.getValue()

      if(!day) return ''

      return (
        <div className='flex flex-col'>          
          <span>{day.taskId}</span>
          <span>{day.taskTitle}</span>
        </div>
      )
    }
  }),
  columnHelper.accessor(row => row.tuesday, {
    header: () => 'Tuesday',
    id: 'Tuesday',
    cell: info => {
      const day = info.getValue()

      if(!day) return ''

      return (
        <div className='flex flex-col'>          
          <span>{day.taskId}</span>
          <span>{day.taskTitle}</span>
        </div>
      )
    }
  }),
  columnHelper.accessor(row => row.wednesday, {
    header: () => 'Wednesday',
    id: 'Wednesday',
    cell: info => {
      const day = info.getValue()
      
      if(!day) return ''
      
      return (
        <div className='flex flex-col'>          
          <span>{day.taskId}</span>
          <span>{day.taskTitle}</span>
        </div>
      )
    }
  }),
  columnHelper.accessor(row => row.thursday, {
    header: () => 'Thursday',
    id: 'Thursday',
    cell: info => {
      const day = info.getValue()
      
      if(!day) return ''
      
      return (
        <div className='flex flex-col'>          
          <span>{day.taskId}</span>
          <span>{day.taskTitle}</span>
        </div>
      )
    }
  }),
  columnHelper.accessor(row => row.friday, {
    header: () => 'Friday',
    id: 'Friday',
    cell: info => {
      const day = info.getValue()

      if(!day) return ''

      return (
        <div className='flex flex-col'>          
          <span>{day.taskId}</span>
          <span>{day.taskTitle}</span>
        </div>
      )
    }
  }),
  columnHelper.accessor(row => row.saturday, {
    header: () => 'Saturday',
    id: 'Saturday',
    cell: info => {
      const day = info.getValue()

      if(!day) return ''

      return (
        <div className='flex flex-col'>          
          <span>{day.taskId}</span>
          <span>{day.taskTitle}</span>
        </div>
      )
    }
  }),
]
export const Table = () => {
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


console.log(tableRows)

  const table = useReactTable({
    data, columns, getCoreRowModel: getCoreRowModel()
  })
  return (
    <table>
    <thead>
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
    <tbody>
       {table.getRowModel().rows.map(row => (
        <tr key={row.id}>
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
