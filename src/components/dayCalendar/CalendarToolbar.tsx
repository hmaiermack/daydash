import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { addDays, endOfDay, format, isSameMonth, startOfDay, subDays } from 'date-fns'
import React, { Fragment, useEffect } from 'react'
import { CalendarContext } from '../../context/CalendarContext'


const CalendarToolbar = () => {
    const { state: CalendarState, dispatch } = React.useContext(CalendarContext)

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

    const displayTypes = ['one', 'three', 'week']

    const [selectedDisplay, setSelectedDisplay] = React.useState(CalendarState.display)

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
                });
                break;
            case 'three':
                dispatch({
                    type: 'changeDisplay',
                    payload: {
                        dateRangeStart: startOfDay(CalendarState.dateRangeStart),
                        dateRangeEnd: endOfDay(addDays(CalendarState.dateRangeStart, 2)),
                        display: 'three',
                    }
                });
                break;
            case 'week':
                dispatch({
                    type: 'changeDisplay',
                    payload: {
                        dateRangeStart: startOfDay(CalendarState.dateRangeStart),
                        dateRangeEnd: endOfDay(addDays(CalendarState.dateRangeStart, 6)),
                        display: 'week',
                    }
                });
                break;
        }
    }, [selectedDisplay])

  return (
    <div className='flex w-full items-center px-4 py-4 justify-between'>
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
                    `${format(CalendarState.dateRangeStart, 'MMM yyyy')}` : `${format(CalendarState.dateRangeEnd, 'M')} - ${format(CalendarState.dateRangeEnd, 'M yyyy')}`

                }
            </span>
        </div>
        <Listbox value={selectedDisplay} onChange={setSelectedDisplay}>
        <div className="relative py-1 px-2 border rounded-sm uppercase tracking-wide text-gray-700 font-semibold hover:bg-slate-100">
          <Listbox.Button className="flex items-center uppercase">
            <span className="block px-4">{selectedDisplay}</span>
            <ChevronDownIcon className="fill-slate-400 w-4 h-4" />
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-4 max-h-60 -left-12 w-40 px-1 rounded-sm bg-white py-2 z-[150] shadow-2xl border">
              {displayTypes.map((display, displayIdx) => (
                <Listbox.Option
                  key={displayIdx}
                  className={({ active }) =>
                    `cursor-default select-none py-2 pl-2 flex w-full items-center ${
                      active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                    }`
                  }
                  value={display}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {display}
                      </span>
                      {selected ? (
                        <span className="flex items-center pl-3 text-blue-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>

        </Listbox>
    </div>
    
  )
}

export default CalendarToolbar