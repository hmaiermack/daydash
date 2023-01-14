import React, { Dispatch, SetStateAction, Fragment, useState, useEffect } from 'react'
import { Dialog, Disclosure, Transition } from '@headlessui/react'
import { Controller, SubmitHandler, useForm, useFormState } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from "zod";
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField } from '@mui/material';
import { addHours, addMinutes, areIntervalsOverlapping, isAfter, isBefore, startOfDay } from 'date-fns';
import { trpc } from '../../utils/trpc';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import ColorPicker from '../general/form/ColorPicker';
import TagNameCombobox from '../general/form/TagNameCombobox';
import { CreateModalContext } from '../../context/CreateModalContext';
import { Tag, Task } from '@prisma/client';
import FormLabel from '../general/form/FormLabel';
import FormInput from '../general/form/FormInput';


type Inputs = {
    title: string,
    startTime: Date,
    endTime: Date,
    tagColor: string,
    tagName: string
}

const CreateModal = ({timeRangeEnd, timeRangeStart, selectedTime, tags, tasks}: {timeRangeEnd: number, timeRangeStart: number, selectedTime: Date, tags: Tag[], tasks: Task[]}) => {
  const [isColorPickerDisabled, setIsColorPickerDisabled] = useState(false)
  const {state, dispatch} = React.useContext(CreateModalContext)
  const schema = z.object({
        title: z.string().min(5, { message: "Must be 5 or more characters long" }),
        startTime: z.date(),
        endTime: z.date(),
        tagColor: z.string().optional().nullable(),
        tagName: z.string().max(10, {message: 'Tag name must be 10 characters or less'}).optional().nullable()
    }).superRefine((val, ctx) => {
      tasks.forEach((task: Task) => {
        if(areIntervalsOverlapping({start: val.startTime, end: val.endTime}, {start: task.timeStart, end: task.timeEnd})) {
          if(isAfter(val.startTime, task.timeStart)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'You already have an event scheduled at this time',
            path: ['startTime']
          })}
          if(isBefore(val.endTime, task.timeEnd)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'You already have an event scheduled at this time',
            path: ['endTime']
          })}
        }
      })

      if (val.endTime < val.startTime) {
        ctx.addIssue({ 
          code: z.ZodIssueCode.custom,
          message: 'End time must be after start time',
          path: ['endTime'] }
        )
      }

      if(isAfter(val.endTime, addHours(startOfDay(val.endTime), timeRangeEnd))) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Your daily schedule doesnt even go that late!',
          path: ['endTime']
        })}

      if(isBefore(val.startTime, new Date)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Why are you scheduling an event in the past?',
          path: ['startTime']
        })}

      if(isBefore(val.endTime, new Date)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Why are you scheduling an event in the past?',
          path: ['endTime']
        })}

      if (val.tagName && !val.tagColor) {
        ctx.addIssue({ 
          code: z.ZodIssueCode.custom,
          message: 'Must have a tag color if you have a tag name',
          path: ['tagColor'] }
        )
      }

      if (val.tagColor && !val.tagName) {
        ctx.addIssue({ 
          code: z.ZodIssueCode.custom,
          message: 'Must have a tag name if you have a tag color',
          path: ['tagName'] }
        )
      }
    })

  
    
    const { register, handleSubmit, watch, formState: { errors }, control, setValue, getValues } = useForm<Inputs>({
      defaultValues: {
        startTime: selectedTime,
        endTime: addMinutes(selectedTime, 30),
        tagName: '',
        tagColor: ''
      },
        resolver: zodResolver(schema)
    });

    const tName = watch("tagName")
    useEffect(() => {
      for(let tag of tags) {
        if(tag.name.toLowerCase() === tName ? tName.toLowerCase() : '') {
          setValue("tagColor", tag.colorHexValue)
          setIsColorPickerDisabled(true)
          break
        } else {
          setIsColorPickerDisabled(false)
        }
      }
    }, [tName, tags, setValue])

    const utils = trpc.useContext()
    const newTask = trpc.useMutation("tasks.new-task", {
        onSuccess(){
            utils.invalidateQueries(['tasks.tasks'])
            dispatch({type: 'closeModal', payload: {
              isModalOpen: false,
              selectedTime: null
            }})
        }
    })

    const handleClose = () => {
      dispatch({type: 'closeModal', payload: {
        isModalOpen: false,
        selectedTime: null
      }})
    }
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
      //if tag name and tag color are both present, create task with tag
      data.tagName && data.tagColor
      ? await newTask.mutateAsync({
        title: data.title.trim(),
        timeStart: data.startTime,
        timeEnd: data.endTime,
        tag: {
          name: data.tagName.trim(),
          colorHexValue: data.tagColor
        }
      })
      : await newTask.mutateAsync({
        title: data.title.trim(),
        timeStart: data.startTime,
        timeEnd: data.endTime,
      })
    }  

  return (
  <>
    <Transition appear show={state.isModalOpen} as={Fragment}>
        <Dialog onClose={handleClose} className="relative z-50">
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
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className='mt-4 pt-4 px-4 bg-blue-100 flex flex-col items-center rounded'>
                  <div className="flex flex-col w-full">
                    <div className='w-full mb-4'>
                      <FormLabel htmlFor="title">Event Name</FormLabel>
                      <FormInput label="title" type="text" error={errors.title}  register={register} placeholder="Your Event"/>
                    </div>
                  <Controller
                    name="startTime"
                    control={control}
                    render={
                        ({ field: { onChange, value } }) =>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DateTimePicker
                            renderInput={(props) => <TextField {...props} />}
                            label="Event Start Time"
                            value={value}
                            onChange={onChange}
                            className={errors.startTime ? 'outline-red-500 text-red-500 mb-4 ring-red-500' : 'mb-4'}
                          />
                        </LocalizationProvider>
                      }
                  /> 
                  {errors.startTime && <span className='text-red-500'>{errors.startTime?.message}</span>}
                  <div className='h-6'></div>
                  <Controller
                    name="endTime"
                    control={control}
                    render={
                        ({ field: { onChange, value } }) =>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DateTimePicker
                            renderInput={(props) => <TextField {...props} />}
                            label="Event End Time"
                            value={value}
                            onChange={onChange}
                            className={errors.startTime ? 'outline-red-500 text-red-500 ring-red-500' : ''}
                          />
                        </LocalizationProvider>
                      }
                  />
                  {errors.endTime && <span className='text-red-500'>{errors.endTime?.message}</span>}
                  </div>
                  <div className="w-full">
                    <div className=''>
                      <Disclosure>
                        {({ open }) => (
                          <>
                          <Disclosure.Button className="flex w-full rounded-lg border p-2 my-4 text-left text-sm font-medium bg-blue-100 text-blue-900 hover:bg-blue-300 focus:outline-none focus-visible:ring-blue-500 focus-visible:ring-opacity-75">
                            <span>Add a tag to your event</span>
                            <ChevronUpIcon
                              className={`${open ? 'transform rotate-180' : ''} w-5 h-5 text-blue-500`}
                            />
                          </Disclosure.Button>
                          <Transition
                            enter="transition duration-100 ease-out"
                            enterFrom='transform scale-95 opacity-0'
                            enterTo='transform scale-100 opacity-100'
                            leave="transition duration-75 ease-out"
                            leaveFrom='transform scale-100 opacity-100'
                            leaveTo='transform scale-95 opacity-0'
                          >
                          <Disclosure.Panel>
                            <Controller
                              name="tagName"
                              control={control}
                              render={({ field }) => <TagNameCombobox {...field} tags={tags} tagColor={getValues("tagColor")} hidden={isColorPickerDisabled}/>}
                            />
                            {errors.tagName && <span className='text-red-500'>{errors.tagName?.message}</span>}
                            <Controller 
                              name="tagColor"
                              control={control}
                              render={({ field }) => <ColorPicker {...field} hidden={isColorPickerDisabled} 
                              />}
                            />
                            {errors.tagColor && <span className='text-red-500'>{errors.tagColor?.message}</span>}
                          </Disclosure.Panel>
                          </Transition>
                          </>
                        )}
                      </Disclosure>
                    </div>

                  </div>
                  </div>
                  <div className='flex w-full justify-between mt-4'>
                      <button type='button'
                              className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                              onClick={handleClose}
                                      
                      >
                          Cancel
                      </button>
                      <button
                          type="submit"
                          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          >
                          Create new Event
                          </button>
                  </div>

                </form> 
                </Dialog.Panel>
            </Transition.Child>
            </div>
        </div>
        </Dialog>
    </Transition>
</>

)
}
export default CreateModal