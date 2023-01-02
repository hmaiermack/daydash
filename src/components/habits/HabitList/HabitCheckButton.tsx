import React from "react";

interface IHabitCheckButtonProps {
    isComplete: boolean
}

function HabitCheckButton({isComplete}: IHabitCheckButtonProps) {
    return (
        <button type="button" className={`w-4 h-4 rounded ${isComplete ? 'bg-green-400' : 'bg-gray-400'}`} aria-label="toggle habit" />
    )
}

export default HabitCheckButton