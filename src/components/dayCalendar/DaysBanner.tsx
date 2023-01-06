import { endOfDay, format, isSameDay, startOfDay } from 'date-fns'
import React from 'react'
import { CalendarContext } from '../../context/CalendarContext'

const DaysBanner = ({day, setSelectedDisplay}: {day: Date, setSelectedDisplay: React.Dispatch<React.SetStateAction<"one" | "three" | "week" | undefined>>}) => {
    const { state: CalendarState, dispatch } = React.useContext(CalendarContext)

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
}

export default DaysBanner