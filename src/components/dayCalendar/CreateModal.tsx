import React, { Dispatch, SetStateAction, Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from "zod";
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField } from '@mui/material';
import { addHours, addMinutes, startOfDay } from 'date-fns';
import { trpc } from '../../utils/trpc';


type Inputs = {
    title: string,
    startTime: Date,
    endTime: Date
}

const CreateModal = ({isOpen, setIsOpen, timeAndDate, timeRangeEnd, timeRangeStart}: {isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>>, timeAndDate: Date, timeRangeEnd: number, timeRangeStart: number}) => {
    const schema = z.object({
        title: z.string().min(5, { message: "Must be 5 or more characters long" }),
        startTime: z.date().min(addHours(startOfDay(timeAndDate), timeRangeStart), {message: 'Why are you scheduling an event in the past?'}),
        endTime: z.date().max(addHours(startOfDay(timeAndDate), timeRangeEnd), {message: 'Your daily schedule doesnt even go that late!'})
    })

    const { register, handleSubmit, watch, formState: { errors }, control } = useForm<Inputs>({
        resolver: zodResolver(schema)
    });
    const [date, setDate] = useState(timeAndDate);
    const [endTime, setEndTime] = useState(addMinutes(date, 30))
    const utils = trpc.useContext()
    const newTask = trpc.useMutation("tasks.new-task", {
        onSuccess(){
            utils.invalidateQueries(['tasks.tasks'])
            setIsOpen(false)
        }
    })


    const onSubmit: SubmitHandler<Inputs> = async (data) => {
      await newTask.mutateAsync({
        title: data.title,
        timeStart: data.startTime,
        timeEnd: data.endTime,
      })
    }

      useEffect(() => {
      setEndTime(addMinutes(date, 30))
    }, [date])
    
  

  return (
    <Transition appear show={isOpen} as={Fragment}>
        <Dialog onClose={() => setIsOpen(false)} className="relative z-50">
            {/* The backdrop, rendered as a fixed sibling to the panel container */}
            <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>
            <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                >
                    Create a new Calendar Event
                </Dialog.Title>
                <form className='mt-4 p-4 flex flex-col items-center rounded bg-gray-200' onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col">
                <input className="mb-4 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" {...register("title")} placeholder="Event Title"/>
                {errors.title && <p>{errors.title?.message}</p>}
                <Controller
                  name="startTime"
                  defaultValue={date}
                  control={control}
                  render={
                      ({ field: { onChange, value } }) =>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                          renderInput={(props) => <TextField {...props} />}
                          label="Event Start Time"
                          value={date}
                          onChange={(event) => {
                            onChange(event)
                            setDate(event!)
                          }}
                        />
                      </LocalizationProvider>
                    }
                /> 
                {errors.startTime && <p>{errors.startTime?.message}</p>}
                <Controller
                  name="endTime"
                  defaultValue={addMinutes(date, 30)}
                  control={control}
                  render={
                      ({ field: { onChange, value } }) =>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                          renderInput={(props) => <TextField {...props} />}
                          label="Event End Time"
                          value={endTime}
                          onChange={(event) => {
                            onChange(event)
                            setEndTime(event!)
                          }}
                          className="mt-4"
                        />
                      </LocalizationProvider>
                    }
                />
                {errors.endTime && <p>{errors.endTime?.message}</p>}
                </div>

                <div className='flex justify-between'>
                    <button type='button'
                            className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                            onClick={() => setIsOpen(false)}
                                    
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        >
                        Got it, thanks!
                        </button>
                </div>

            </form> 
                <div className="mt-4">
                </div>
                </Dialog.Panel>
            </Transition.Child>
            </div>
        </div>
        </Dialog>
    </Transition>


)
}
export default CreateModal