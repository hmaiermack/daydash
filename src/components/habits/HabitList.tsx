import React, {  } from "react";
import HabitRow from "./HabitList/HabitRow";

function HabitList() {
const habits = [
    {
        name: "Wake up",
        id: "58dx7123",
        isCompleted: false,
        remindTime: "8AM"
    },
    {
        name: "Go to sleepGo to sleepGo to sleepGo to sleepGo to sleep",
        id: "532x7123",
        isCompleted: false,
        remindTime: "8AM"
    },
    {
        name: "Ham",
        id: "58dx233223",
        isCompleted: true
    },
    {
        name: "Ham",
        id: "58dx233223",
        isCompleted: true
    },
    {
        name: "Ham",
        id: "58dx233223",
        isCompleted: true
    },
    {
        name: "Ham",
        id: "58dx233223",
        isCompleted: true
    },
    {
        name: "Ham",
        id: "58dx233223",
        isCompleted: true
    },
    {
        name: "Ham",
        id: "58dx233223",
        isCompleted: true
    },
    {
        name: "Ham",
        id: "58dx233223",
        isCompleted: true
    },
    {
        name: "Ham",
        id: "58dx233223",
        isCompleted: true
    },
    {
        name: "Ham",
        id: "58dx233223",
        isCompleted: true
    },
    {
        name: "Ham",
        id: "58dx233223",
        isCompleted: true
    },
    {
        name: "Ham",
        id: "58dx233223",
        isCompleted: true
    },
    {
        name: "Ham",
        id: "58dx233223",
        isCompleted: true
    },
    {
        name: "Ham",
        id: "58dx233223",
        isCompleted: true
    },
    {
        name: "Ham",
        id: "58dx233223",
        isCompleted: true
    },
    {
        name: "Ham",
        id: "58dx233223",
        isCompleted: true
    },
    {
        name: "Ham",
        id: "58dx233223",
        isCompleted: true
    },
    {
        name: "Ham",
        id: "58dx233223",
        isCompleted: true
    },
]


//round up to nearest whole number

const cols = Math.ceil(habits.length / 4)
console.log(cols)

return (
    <div className="bg-slate-100 rounded py-2 px-4 md:h-80 flex-grow">
        <h2 className="font-semibold text-lg self-start text-gray-600">Your Habits</h2>
        <div className="flex flex-col gap-4 md:flex-wrap max-h-full overflow-auto">
            {habits.map((habit) => ( <HabitRow id={habit.id} key={habit.id} name={habit.name} isCompleted={habit.isCompleted} remindTime={habit.remindTime} /> ))}
        </div>
    </div>
)
}

export default HabitList