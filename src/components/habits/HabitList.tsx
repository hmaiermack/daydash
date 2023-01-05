import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
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
        habitName: z.string(),
        sunday: z.boolean(),
        monday: z.boolean(),
        tuesday: z.boolean(),
        wednesday: z.boolean(),
        thursday: z.boolean(),
        friday: z.boolean(),
        saturday: z.boolean()
    })

    const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<Inputs>({
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
    console.log(watch())
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
        console.log("submit handler", data)
        newHabit.mutateAsync({
            name: data.habitName,
            habitDays: [data.sunday, data.monday, data.tuesday, data.wednesday, data.thursday, data.friday, data.saturday]
        })
    }




return (
    <div className="bg-slate-100 rounded py-2 px-4 md:h-80 flex-grow flex flex-col justify-between">
        <div>
        <h2 className="font-semibold text-lg self-start text-gray-600">Your Habits</h2>
        {habitData && 
            <div className="flex flex-col gap-4 md:flex-wrap max-h-full overflow-auto">
                {habitData.map((habit) => ( <HabitRow id={habit.id} key={habit.id} name={habit.name} isCompleted={habit.isCompleted} remindTime={null} /> ))}
            </div>
        }
        </div>
        {newHabitInput &&    
            <form onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="habitName">Habit Name</label>
                <input type="text" className="bg-white p-2 rounded" {...register("habitName")}/>
                    <label htmlFor="sunday">Sun</label>
                    <input type="checkbox" className="bg-white p-2 rounded" {...register("sunday")}/>
                    <label htmlFor="monday">Mon</label>
                    <input type="checkbox" className="bg-white p-2 rounded" {...register("monday")} />
                    <label htmlFor="tuesday">Tues</label>
                    <input type="checkbox" className="bg-white p-2 rounded" {...register("tuesday")} />
                    <label htmlFor="wednesday">Weds</label>
                    <input type="checkbox" className="bg-white p-2 rounded" {...register("wednesday")} />
                    <label htmlFor="thursday">Thurs</label>
                    <input type="checkbox" className="bg-white p-2 rounded" {...register("thursday")} />
                    <label htmlFor="friday">Fri</label>
                    <input type="checkbox" className="bg-white p-2 rounded" {...register("friday")} />
                    <label htmlFor="saturday">Sat</label>
                    <input type="checkbox" className="bg-white p-2 rounded" {...register("saturday")} />
                <div className="flex w-full justify-between mt-4">
                    {errors && errors.habitName && <p className="text-red-500">{errors.habitName.message}</p>
                    }
                    {errors && errors.sunday && <p className="text-red-500">{errors.sunday.message}</p>
                    }
                    {errors && errors.monday && <p className="text-red-500">{errors.monday.message}</p>}
                    {errors && errors.tuesday && <p className="text-red-500">{errors.tuesday.message}</p>}
                    {errors && errors.wednesday && <p className="text-red-500">{errors.wednesday.message}</p>}
                    {errors && errors.thursday && <p className="text-red-500">{errors.thursday.message}</p>}
                    {errors && errors.friday && <p className="text-red-500">{errors.friday.message}</p>}
                    {errors && errors.saturday && <p className="text-red-500">{errors.saturday.message}</p>}
                    <button type="button" className="bg-red-400 hover:bg-red-500 hover:cursor-pointer text-white p-2 rounded max-w-fit" onClick={handleClose}>
                        Cancel
                    </button>
                    <button type="submit" className="bg-green-400 hover:bg-green-500 hover:cursor-pointer text-white p-2 rounded max-w-fit">
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