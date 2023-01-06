import { addHours, format } from 'date-fns'
import React from 'react'

const TimeColumn = ({hours, timeRangeEnd = 19, timeRangeStart = 9, lastHour}: {hours: Date[], timeRangeEnd?: number, timeRangeStart?: number, lastHour: Date | undefined}) => {
  return (
    <div className={`grid relative grid-cols-1 grid-rows-[${timeRangeEnd - timeRangeStart}]`}>
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

  )
}

export default TimeColumn