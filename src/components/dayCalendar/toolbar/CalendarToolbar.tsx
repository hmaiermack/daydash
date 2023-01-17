import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { Tag } from '@prisma/client'
import { addDays, endOfDay, endOfWeek, format, isSameMonth, startOfDay, startOfWeek, subDays } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { CalendarContext } from '../../../context/CalendarContext'
import { trpc } from '../../../utils/trpc'
import DisplayMenu from './DisplayMenu'
import FilterMenu from './FilterMenu'
import OptionsMenu from './OptionsMenu'


const CalendarToolbar = ({selectedDisplay, setSelectedDisplay, tags}: {
    selectedDisplay: "one" | "three" | "week" | undefined, 
    setSelectedDisplay: React.Dispatch<React.SetStateAction< "one" | "three" | "week" | undefined >>,
    tags: Tag[] | undefined
    }) => {
    const { state: CalendarState, dispatch } = React.useContext(CalendarContext)

    const utils = trpc.useContext()

    const handleToday = () => {
        dispatch({type: 'changeDisplay', payload: {
            dateRangeStart: startOfDay(new Date),
            dateRangeEnd: endOfDay(new Date),
            display: 'one',
        }})
    }

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

    const [filterOptions, setFilterOptions] = useState<null | Tag>(null)

    useEffect(() => {
        switch (selectedDisplay) {
            case 'one':
                dispatch({
                    type: 'changeDisplay',
                    payload: {
                        dateRangeStart: startOfDay(CalendarState.dateRangeStart),
                        dateRangeEnd: endOfDay(CalendarState.dateRangeStart),
                        display: 'one',
                    }
                })
                utils.invalidateQueries('tasks.tasks')
                break;
            case 'three':
                dispatch({
                    type: 'changeDisplay',
                    payload: {
                        dateRangeStart: startOfDay(CalendarState.dateRangeStart),
                        dateRangeEnd: endOfDay(addDays(CalendarState.dateRangeStart, 2)),
                        display: 'three',
                    }
                })
                utils.invalidateQueries('tasks.tasks')
                break;
            case 'week':
                dispatch({
                    type: 'changeDisplay',
                    payload: {
                        dateRangeStart: startOfWeek(CalendarState.dateRangeStart),
                        dateRangeEnd: endOfWeek(CalendarState.dateRangeStart),
                        display: 'week',
                    }
                })
                utils.invalidateQueries('tasks.tasks')
                break;
        }
    }, [selectedDisplay])

    useEffect(() => {
        filterOptions ?
        dispatch({type: 'changeFilter', payload: {
            filterByTagName: filterOptions?.name,
            dateRangeStart: CalendarState.dateRangeStart,
            dateRangeEnd: CalendarState.dateRangeEnd,
        }}) : 
        dispatch({type: 'changeFilter', payload: {
            filterByTagName: undefined,
            dateRangeStart: CalendarState.dateRangeStart,
            dateRangeEnd: CalendarState.dateRangeEnd,
        }})
    }, [filterOptions])

  return (
    <div className='flex flex-col md:flex-row w-full items-center px-4 py-4 justify-between'>
        <div className='flex items-center '>
            <button className='border rounded-sm py-1 px-2 uppercase tracking-wide text-gray-700 text-xs font-bold hover:bg-slate-100'
                onClick={handleToday}>
                Today - {CalendarState.today ? format(CalendarState.today, 'E MMM. dd') : format(new Date, 'E MMM. dd')}
            </button>
            <ChevronLeftIcon className='ml-4 w-8 h-8 fill-slate-400 hover:bg-slate-50 rounded-full' onClick={handleMoveTimeBackward} />
            <ChevronRightIcon className='mr-4 w-8 h-8 fill-slate-400 hover:bg-slate-50 rounded-full' onClick={handleMoveTimeForward} />
            <span className='uppercase tracking-wide text-gray-700 font-bold'>
                {
                    CalendarState.display != 'one' && isSameMonth(CalendarState.dateRangeStart, CalendarState.dateRangeEnd) ?
                    `${format(CalendarState.dateRangeStart, 'MMM yyyy')}` : `${format(CalendarState.dateRangeEnd, 'MMMM yyyy')}`
                }
            </span>
        </div>
        <div className='flex gap-4 flex-wrap justify-center'>
            <FilterMenu tags={tags} filterOptions={filterOptions} setFilterOptions={setFilterOptions} />
            <DisplayMenu selectedDisplay={selectedDisplay} setSelectedDisplay={setSelectedDisplay} />
            <OptionsMenu />
      </div>
    </div>
  )
}

export default CalendarToolbar