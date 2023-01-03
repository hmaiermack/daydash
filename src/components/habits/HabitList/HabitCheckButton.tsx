import React from "react";
import { trpc } from "../../../utils/trpc";

interface IHabitCheckButtonProps {
    isComplete: boolean,
    habitId: string,
}

function HabitCheckButton({isComplete, habitId}: IHabitCheckButtonProps) {
    const toggleHabit = trpc.useMutation(['habits.toggle-habit-completion'], {
        onSuccess: () => {
            utils.invalidateQueries(['habits.habits'])
        }
    })
    const utils = trpc.useContext()

    const handleClick = () => {
        console.log(habitId)
        toggleHabit.mutate({isComplete, habitId})
    }

    return (
        <button type="button" className={`w-4 h-4 rounded ${isComplete ? 'bg-green-400' : 'bg-gray-400'}`} aria-label="toggle habit" onClick={handleClick}/>
    )
}

export default HabitCheckButton