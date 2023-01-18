import { Disclosure, Listbox, Menu, Popover, Transition } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon, ClockIcon, UserCircleIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { zodResolver } from '@hookform/resolvers/zod'
import { signOut, useSession } from 'next-auth/react'
import React, { Fragment, useContext, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { CalendarContext } from '../../../context/CalendarContext'
import { trpc } from '../../../utils/trpc'
import CLink from '../../general/CLink'

//TODO: Honestly, time range for calendar display should be kept in local storage

type Inputs = {
  start: number,
  end: number,
}

const OptionsMenu = () => {
    const {data: session} = useSession()
    const {state: CalendarState} = useContext(CalendarContext)
    const [isOpen, setIsOpen] = useState(false)
    const utils = trpc.useContext()
    //this can be MUCH better....
    const { data: user } = trpc.useQuery(['tasks.tasks', {startDate: CalendarState.dateRangeStart, endDate: CalendarState.dateRangeEnd},], {
      onSuccess: (data) => {
        setValue('start', data.timeRangeStart)
        setValue('end', data.timeRangeEnd)
      }
    })

    const updateTimeRange = trpc.useMutation('users.update-time-range')
    const times = new Array(24).fill(0).map((_, i) => i == 0 || 1 ? i : i -1)

    const schema = z.object({
        start: z.number().min(0).max(23),
        end: z.number().min(0).max(23),
    }).refine(data => data.start < data.end, {
        message: 'Start time must be before end time',
        path: ['end']
    })

    const { handleSubmit, formState: { errors }, control, setValue, reset } = useForm<Inputs>({
      defaultValues: {
        start: 9,
        end: 17,
      },
        resolver: zodResolver(schema)
    });

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
      await updateTimeRange.mutateAsync({timeStart: data.start, timeEnd: data.end})
      utils.refetchQueries(['tasks.tasks'])
      setIsOpen(false)
    }  




  return (
    <Popover as="div" className="relative border rounded-sm text-gray-700 hover:bg-slate-100">
    <div>
      <Popover.Button className="flex items-center uppercase py-1 px-2 ">
        <span className="block px-4 uppercase tracking-wide  font-semibold">Options</span>
        <ChevronDownIcon className="fill-slate-400 w-4 h-4" />
      </Popover.Button>
    </div>
    <Transition
      as={Fragment}
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <Popover.Panel className="absolute right-0 mt-4 z-[200] rounded-sm origin-top-right  bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
      <div className="px-1 py-2 divide-y divide-gray-100">
            <CLink href={`/user/${session?.user.id}`}>
            <button
              className={`hover:bg-blue-100 hover:text-blue-900 text-gray-700 flex w-full items-center py-2 text-sm tracking-tighter`}
            >
              {session?.user.name ? (
                <div className='flex px-1'>
                  <UserCircleIcon className="h-5 w-5 mr-2" />
                  <span>{session.user.name}</span>
                </div>
              ): (
                <div className='flex px-1'>
                <UserCircleIcon className="h-5 w-5 mr-2" />
                <span>{session?.user.email}</span>
              </div>
              )}
            </button>
            </CLink>
          {user &&
            <Disclosure>
              {({ close }) => (
                <>
                <Disclosure.Button
                  onClick={() => setIsOpen(true)}
                  className={`hover:bg-blue-100 hover:text-blue-900 text-gray-700 flex w-full items-center py-2 text-sm tracking-tighter`}
                  >
                  <div className='flex px-1'>
                    <ClockIcon className="h-5 w-5 mr-2" />
                    <span>Calendar Display Range</span>
                  </div>
                </Disclosure.Button>
                {isOpen &&
                  <Disclosure.Panel>
                    <form className="flex flex-col p-2 bg-slate-50" onSubmit={handleSubmit(onSubmit)}>
                      <Controller
                        name="start"
                        control={control}
                        render={
                          ({ field: { value, onChange } }) => 
                            <Listbox value={value} onChange={onChange}>
                            <Listbox.Label className={`block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2`}>Calendar Start</Listbox.Label>
                            <Listbox.Button className="hover:bg-blue-200">{({ value }) => value === 0 ? <span>{(value + 12) + " AM"}</span> : value > 0 && value <= 11 ? <span>{(value + " AM")}</span> : value > 12 ? <span>{((value - 12) + " PM")}</span> : <span>{(value + " PM")}</span>}</Listbox.Button>
                            <Transition
                              as={Fragment}
                              leave="transition ease-in duration-100"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                              >
                            <Listbox.Options className="max-h-60 overflow-auto px-1">
                              {times.map((time) => (
                                <Listbox.Option key={time} value={time}
                                className={({ active }) =>
                                `cursor-default select-none py-2 pl-2 flex w-full items-center ${
                                active ? 'bg-blue-200 text-blue-900' : 'text-gray-900'
                                    }`
                                }
                                >
                                  {({ selected }) => (
                                    <div className='flex gap-2'>
                                      {time === 0 ? (time + 12) + " AM" : time > 0 && time <= 11 ? time + " AM" : time > 12 ?(time - 12) + " PM" : time + " PM"}
                                      {selected ? (
                                        <span className="flex items-center pl-3 text-blue-600">
                                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                        </span>
                                      ) : null}
                                    </div>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                            </Transition>
                            </Listbox>
                        }
                      />

                      <Controller
                        name="end"
                        control={control}
                        render={
                          ({ field: { value, onChange } }) => 
                            <Listbox value={value} onChange={onChange}>
                            <Listbox.Label className={`block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2`}>Calendar End</Listbox.Label>
                            <Listbox.Button className="hover:bg-blue-200">{({ value }) => value === 0 ? <span>{(value + 12) + " AM"}</span> : value > 0 && value <= 11 ? <span>{(value + " AM")}</span> : value > 12 ? <span>{((value - 12) + " PM")}</span> : <span>{(value + " PM")}</span>}</Listbox.Button>
                            <Transition
                              as={Fragment}
                              leave="transition ease-in duration-100"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                              >
                            <Listbox.Options className="max-h-60 overflow-auto px-1">
                              {times.map((time) => (
                                <Listbox.Option key={time} value={time}
                                className={({ active }) =>
                                `cursor-default select-none py-2 pl-2 flex w-full items-center ${
                                active ? 'bg-blue-200 text-blue-900' : 'text-gray-900'
                                    }`
                                }
                                >
                                  {({ selected }) => (
                                    <div className='flex gap-2'>
                                      {time === 0 ? (time + 12) + " AM" : time > 0 && time <= 11 ? time + " AM" : time > 12 ?(time - 12) + " PM" : time + " PM"}
                                      {selected ? (
                                        <span className="flex items-center pl-3 text-blue-600">
                                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                        </span>
                                      ) : null}
                                    </div>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                            </Transition>
                            </Listbox>
                        }
                      />
                      {errors.end && <span className='text-red-500 text-xs italic'>{errors.end.message}</span>}
                      <div className='flex justify-between px-2 mt-2'>
                        <button onClick={() => {
                          close()
                          reset()
                          }}>
                          <XMarkIcon className="h-5 w-5 border hover:bg-red-400 hover:text-white" />
                        </button>
                        <button type="submit" >
                          <CheckIcon className="h-5 w-5 border hover:bg-green-400 hover:text-white" />
                        </button>
                      </div>
                    </form>
                  </Disclosure.Panel>
                }
                </>
              )}
            </Disclosure>
          }            
            <button
              className={`hover:bg-red-400 hover:text-white text-gray-700 flex w-full items-center py-2 text-sm tracking-tighter`}
              onClick={() => signOut()}
            >
              <div className='flex px-1'>
                <span>Sign Out</span>
              </div>
            </button>
      </div>
      </Popover.Panel>
    </Transition>
  </Popover>

  )
}

export default OptionsMenu