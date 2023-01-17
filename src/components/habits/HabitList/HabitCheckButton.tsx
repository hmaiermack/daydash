import { Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import React from "react";
import { toast } from "react-hot-toast";
import { trpc } from "../../../utils/trpc";

interface IHabitCheckButtonProps {
    isComplete: boolean,
    habitId: string,
}

function HabitCheckButton({isComplete, habitId}: IHabitCheckButtonProps) {
    const toggleHabit = trpc.useMutation(['habits.toggle-habit-completion'], {
        onError: (err) => {
            toast.error("Something went wrong. Please try again later.")
        },
        onSuccess: () => {
            utils.invalidateQueries(['habits.habits'])
            toast.success('Habit updated!')
        },
        //@ts-ignore
        useErrorBoundary: (err) => err.data?.httpStatus >= 500,
    })

    const utils = trpc.useContext()

    const handleClick = () => {
        toggleHabit.mutate({isComplete, habitId})
        toggleHabit.isLoading && toast.loading('Loading...')
    }

    return (
        <button aria-label="toggle habit" onClick={handleClick}><CheckIcon className={`w-5 h-5 border border-slate-400 font-extrabold rounded-sm transition ease-in-out delay-75 hover:scale-110 hover:-translate-y-[2px] ${isComplete ? `bg-green-400 hover:bg-red-400 text-white border-none` : 'hover:bg-green-400 hover:text-white hover:border-none'}`}/></button>
    )
}

export default HabitCheckButton