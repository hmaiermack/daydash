import React, { useState } from 'react'
import { times } from '../../utils/constants'
import { useTable } from 'react-table'
import { trpc } from '../../utils/trpc'
import { Tag, Task } from '@prisma/client'
import { addDays, addHours, eachDayOfInterval, eachHourOfInterval, endOfDay, format, isSameHour, nextSaturday, previousSunday, startOfDay } from 'date-fns'

export const DayTable = () => {

    
    const [date, setDate] = useState(new Date)
    const weekStart = startOfDay(previousSunday(date))
    const weekEnd = endOfDay(nextSaturday(date))
    const { isLoading, isError, data: taskData, error } = trpc.useQuery(["tasks.tasks", {date}]);  
    //define user time range from 8 am to 4 pm
    const dayCols: { Header: string, accessor: string}[] = []
    for(let i = 0; i <= 6; i++){
        const day = format(addDays(weekStart, i), "EEEE")
        dayCols.push({
            Header: day,
            accessor: day
        })
    }
    //needs to be persisted via db
    const userRange = [8, 16] as const
    //convert it to an array usable by react-table
    const tableTimes = times.slice(userRange[0], userRange[1])
    //this is kind of fucky
    type timesVal = { [key:string]: string}
    const timesArray: timesVal[] = []
    tableTimes.forEach(time => timesArray.push({'times': time}))

    let test: any = []

    const tableRows: any[] = []
    if(taskData) {
        const days = eachDayOfInterval({
            start: weekStart,
            end: weekEnd
        })
        let day = weekStart
        for(let i = userRange[0]; i < userRange[1]; i++) {
            const tempRowObject: {[key:string]: any} = {}
            const hourString = addHours(day, i)
            days.forEach(day => {
                const hour = addHours(day, i)
                let temp: undefined | (Task & {tag: Tag | null})
                taskData.forEach(task => {if(isSameHour(task.timeStart, hour)){temp = task}})
                // const task = taskData.find(task => {
                //     isSameHour(task.timeStart, hour)
                // })
                if(temp !== undefined) {
                    tempRowObject[format(day, "EEEE")] = temp.title
                } else {
                    tempRowObject[format(day, "EEEE")] = null
                }
            })
            tempRowObject.times = format(hourString, "h:mm aa")
            tableRows.push(tempRowObject)
            day = addDays(day, 1)
        }
        // days.forEach(day => {
        //     const hourInterval = eachHourOfInterval({
        //         start: addHours(day, userRange[0]),
        //         end: addHours(day, (userRange[1] - 1))
        //     })
        //     hourInterval.forEach(hour => {
        //         const task = taskData.find(task => {
        //             return isSameHour(task.timeStart, hour)
        //         })
        //         if(task != undefined) {
        //             tasksPerDay.push({
        //                 times: format(hour, "h:mm aa"),
        //                 [format(day, "EEEE")]: task.title
        //             })
        //         } else {
        //             tasksPerDay.push({
        //                 times: format(hour, "h:mm aa"),
        //                 [format(day, "EEEE")]: ''
        //             })
        //         }
        //     })
        // })

        test = tableRows
    }

    console.log(test)


    const data = React.useMemo(() => [...test], [])

    const columns = React.useMemo(() => [
        {
            Header: '',
            accessor: 'times',
        },
        ...dayCols
    ], [])
    const tableInstance = useTable({columns, data})

    const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} = tableInstance
  return (
    <table {...getTableProps()}>
        <thead>
            { headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                    { headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps()}>
                            {column.render('Header')}
                        </th>
                        ))
                    }
                </tr>
            ))
            }
        </thead>
        <tbody {...getTableBodyProps()}>
            {
                rows.map(row => {
                    prepareRow(row)
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return (
                                    <td {...cell.getCellProps()}>
                                        {cell.render('Cell')}
                                    </td>
                                )
                            })}
                        </tr>
                    )
                })
            }
        </tbody>
    </table>
  )
}
