import React, { useState } from 'react'
import { createColumn, getCoreRowModel, flexRender, createColumnHelper, useReactTable } from '@tanstack/react-table'


type TimeRow = {
  time: string,
  sunday?: {
    taskId: string,
    taskTitle: string,
    tagId?: string,
    tagColorValue?: string,
    tagName?: string,
  },
  monday?: {
    taskId: string,
    taskTitle: string,
    tagId?: string,
    tagColorValue?: string,
    tagName?: string,
  },
  tuesday?: {
    taskId: string,
    taskTitle: string,
    tagId?: string,
    tagColorValue?: string,
    tagName?: string,
  },
  wednesday?: {
    taskId: string,
    taskTitle: string,
    tagId?: string,
    tagColorValue?: string,
    tagName?: string,
  },
  thursday?: {
    taskId: string,
    taskTitle: string,
    tagId?: string,
    tagColorValue?: string,
    tagName?: string,
  },
  friday?: {
    taskId: string,
    taskTitle: string,
    tagId?: string,
    tagColorValue?: string,
    tagName?: string,
  },
  saturday?: {
    taskId: string,
    taskTitle: string,
    tagId?: string,
    tagColorValue?: string,
    tagName?: string,
  },
}

const defaultData: TimeRow[] = [
  {
    time: '8:00 AM',
    sunday: {
      taskId: '1',
      taskTitle: 'A title'
    }
  },
  {
    time: '9:00 AM',
    sunday: {
      taskId: '2',
      taskTitle: 'Another title'
    }
  }
]

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
  })
]
export const Table = () => {
  const [data, setData] = useState(() => [...defaultData])
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
