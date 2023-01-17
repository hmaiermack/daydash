import { Switch } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { Fragment, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { trpc } from "../../utils/trpc";
import HabitRow from "./HabitList/HabitRow";

type Inputs = {
    habitName: string,
    sunday: boolean,
    monday: boolean,
    tuesday: boolean,
    wednesday: boolean,
    thursday: boolean,
    friday: boolean,
    saturday: boolean,
}

function HabitList() {
    const [newHabitInput, setNewHabitInput] = useState(false)

    const schema = z.object({
        habitName: z.string().min(1),
        sunday: z.boolean(),
        monday: z.boolean(),
        tuesday: z.boolean(),
        wednesday: z.boolean(),
        thursday: z.boolean(),
        friday: z.boolean(),
        saturday: z.boolean()
    }).superRefine((val, ctx) => {
        const days = [val.sunday, val.monday, val.tuesday, val.wednesday, val.thursday, val.friday, val.saturday]
        if (!days.includes(true)) {
            return ctx.addIssue({
                //kinda gross to set path like this, but it works
                path: ['sunday'],
                code: z.ZodIssueCode.custom,
                message: "You must select at least one day to do a habit.",
                fatal: true,
            })
        }
    })

    const { register, handleSubmit, formState: { errors }, watch, reset, control } = useForm<Inputs>({
        defaultValues: {
            habitName: '',
            sunday: true,
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: true,
        },
        resolver: zodResolver(schema),
    })
    const utils = trpc.useContext()
    const { data: habitData } = trpc.useQuery(['habits.habits'])
    const handleClose = () => {
        setNewHabitInput(false)
        reset()
    }
    const newHabit = trpc.useMutation('habits.new-habit', {
        onSuccess() {
            utils.invalidateQueries(['habits.habits'])
            handleClose()
        },
    })


    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        newHabit.mutateAsync({
            name: data.habitName,
            habitDays: [data.sunday, data.monday, data.tuesday, data.wednesday, data.thursday, data.friday, data.saturday]
        })
    }




return (
    <div className="bg-slate-100 rounded py-2 px-4 md:min-h-[20rem] flex-grow flex flex-col justify-between">
        <div>
        <h2 className="font-semibold text-lg self-start text-gray-600">Your Habits</h2>
        {habitData && 
            <div className="flex flex-col gap-4 md:flex-wrap max-h-full overflow-auto">
                {habitData.map((habit) => ( <HabitRow id={habit.id} key={habit.id} name={habit.name} isCompleted={habit.isCompleted} remindTime={null} habitDays={habit.habitDays} /> ))}
            </div>
        }
        </div>
        {newHabitInput &&    
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="habitName">Habit Name</label>
                <input type="text" className={`appearance-none block bg-white text-gray-900 border font-medium ${errors.habitName ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-400 focus:outline-none'} rounded-lg py-3 px-3 leading-tight`} {...register("habitName")}/>
                {errors.habitName && <p className="text-red-500 text-xs italic">Please enter a habit name</p>}
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 mt-4">Select the days of the week you want to do this habit</label>
                {errors.sunday && <p className="text-red-500 text-xs italic">You must select at least one day to do a habit.</p>}
                <div className="flex w-full justify-between mt-4">
                    <div className="flex gap-2 flex-grow flex-wrap">
                    <Controller
                            name="sunday"
                            control={control}
                            render={({ field: {onChange} }) => (
                                <Switch onChange={onChange} defaultChecked={true} as={Fragment}>
                                {({ checked }) => (
                                <button
                                    className={`${
                                    checked ? 'bg-green-400 text-white hover:bg-green-500 hover:cursor-pointer' : 'bg-red-400 text-white hover:bg-red-500 hover:cursor-pointer'
                                    } relative inline-flex w-12 py-2 items-center`}
                                >
                                    <span className="mx-auto">Sun</span>
                                </button>
                                )}
                            </Switch>
                            )}
                        />  
                        <Controller
                            name="monday"
                            control={control}
                            render={({ field: {onChange} }) => (
                                <Switch onChange={onChange} defaultChecked={true} as={Fragment}>
                                {({ checked }) => (
                                <button
                                    className={`${
                                    checked ? 'bg-green-400 text-white hover:bg-green-500 hover:cursor-pointer' : 'bg-red-400 text-white hover:bg-red-500 hover:cursor-pointer'
                                    } relative inline-flex w-12 py-2 items-center`}
                                >
                                    <span className="mx-auto">Mon</span>
                                </button>
                                )}
                            </Switch>
                            )}
                        />  
                        <Controller
                            name="tuesday"
                            control={control}
                            render={({ field: {onChange} }) => (
                                <Switch onChange={onChange} defaultChecked={true} as={Fragment}>
                                {({ checked }) => (
                                <button
                                    className={`${
                                    checked ? 'bg-green-400 text-white hover:bg-green-500 hover:cursor-pointer' : 'bg-red-400 text-white hover:bg-red-500 hover:cursor-pointer'
                                    } relative inline-flex w-12 py-2 items-center`}
                                >
                                    <span className="mx-auto">Tues</span>
                                </button>
                                )}
                            </Switch>
                            )}
                        />  
                        <Controller
                            name="wednesday"
                            control={control}
                            render={({ field: {onChange} }) => (
                                <Switch onChange={onChange} defaultChecked={true} as={Fragment}>
                                {({ checked }) => (
                                <button
                                    className={`${
                                    checked ? 'bg-green-400 text-white hover:bg-green-500 hover:cursor-pointer' : 'bg-red-400 text-white hover:bg-red-500 hover:cursor-pointer'
                                    } relative inline-flex w-12 py-2 items-center`}
                                >
                                    <span className="mx-auto">Weds</span>
                                </button>
                                )}
                            </Switch>
                            )}
                        />  
                        <Controller
                            name="thursday"
                            control={control}
                            render={({ field: {onChange} }) => (
                                <Switch onChange={onChange} defaultChecked={true} as={Fragment}>
                                {({ checked }) => (
                                <button
                                    className={`${
                                    checked ? 'bg-green-400 text-white hover:bg-green-500 hover:cursor-pointer' : 'bg-red-400 text-white hover:bg-red-500 hover:cursor-pointer'
                                    } relative inline-flex w-12 py-2 items-center`}
                                >
                                    <span className="mx-auto">Thurs</span>
                                </button>
                                )}
                            </Switch>
                            )}
                        />  
                        <Controller
                            name="friday"
                            control={control}
                            render={({ field: {onChange} }) => (
                                <Switch onChange={onChange} defaultChecked={true} as={Fragment}>
                                {({ checked }) => (
                                <button
                                    className={`${
                                    checked ? 'bg-green-400 text-white hover:bg-green-500 hover:cursor-pointer' : 'bg-red-400 text-white hover:bg-red-500 hover:cursor-pointer'
                                    } relative inline-flex w-12 py-2 items-center`}
                                >
                                    <span className="mx-auto">Fri</span>
                                </button>
                                )}
                            </Switch>
                            )}
                        />  
                        <Controller
                            name="saturday"
                            control={control}
                            render={({ field: {onChange} }) => (
                                <Switch onChange={onChange} defaultChecked={true} as={Fragment}>
                                {({ checked }) => (
                                <button
                                    className={`${
                                    checked ? 'bg-green-400 text-white hover:bg-green-500 hover:cursor-pointer' : 'bg-red-400 text-white hover:bg-red-500 hover:cursor-pointer'
                                    } block w-12 py-2 items-center`}
                                >
                                    <span className="mx-auto">Sat</span>
                                </button>
                                )}
                            </Switch>
                            )}
                        />  
                    </div>
                </div>
                <div className="flex gap-12 mt-4">
                <button type="button" className="bg-red-400 hover:bg-red-500 hover:cursor-pointer text-white p-2 rounded max-w-fit" onClick={handleClose}>
                        Cancel
                    </button>
                    <button type="submit" className="bg-blue-400 hover:bg-blue-500 hover:cursor-pointer text-white p-2 rounded max-w-fit">
                        Create Habit
                    </button>

                </div>
            </form>
            }        
            { !newHabitInput && 
            <button className="bg-green-400 hover:bg-green-500 hover:cursor-pointer text-white p-2 rounded max-w-fit mt-4" onClick={() => setNewHabitInput(true)}>
                Create new habit
            </button>
        }
    </div>
)
}

export default HabitList