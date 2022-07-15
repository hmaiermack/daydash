import React from 'react'
import { times } from '../../utils/constants'
import { useTable } from 'react-table'

export const DayTable = () => {
    //define user time range from 8 am to 4 pm
    const userRange = [8, 16]
    //convert it to an array usable by react-table
    const tableTimes = times.slice(userRange[0], userRange[1])
    type val = { [key:string]: string}
    const tObj: val[] = []
    tableTimes.forEach(time => tObj.push({'times': time}))
    console.log(tObj)
    const data = React.useMemo(() => tObj, [])

    const columns = React.useMemo(() => [
        {
            Header: 'Time',
            accessor: 'times',
        },
        {
            Header: 'Tasks',
            accessor: 'col2',
        }
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
