import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon, PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/20/solid";
import React, { Fragment, useEffect, useState } from "react";
import { trpc } from "../../../utils/trpc";
import EditHabitModal from "./EditHabitModal";
import HabitCheckButton from "./HabitCheckButton";

interface IHabitRowProps {
    id: string,
    name: string,
    remindTime: string | null,
    isCompleted: boolean,
    habitDays: boolean[]
}

function HabitRow({
    id, name, isCompleted, remindTime = null, habitDays
}: IHabitRowProps) {
    const [isOptionsOpen, setIsOptionsOpen] = React.useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)

    const utils = trpc.useContext()

    const deleteHabit = trpc.useMutation(["habits.delete-habit"], {
        onSuccess() {
            utils.invalidateQueries(["habits.habits"])
            setIsOptionsOpen(false)
        },
    })

    const handleDelete = () => {
        deleteHabit.mutateAsync({habitId: id})
    }


 return (
    <div key={id} className="flex md:w-64">
        <div className="flex w-full bg-white border border-slate-300 p-2 rounded items-center justify-between">
            <div className="flex items-start justify-start max-w-fit overflow-hidden">
                <span className="whitespace-nowrap ">
                    {name} 
                    {remindTime ?  <span className="text-gray-500 text-sm ml-2">{remindTime}</span> : null }
                </span>
            </div>
            <div className="flex items-center">
                    {!isOptionsOpen ? (
                        <div className="flex items-center">
                            <HabitCheckButton isComplete={isCompleted} habitId={id} />
                            <button onClick={() => setIsOptionsOpen(true)}>
                                <EllipsisVerticalIcon className="w-5 h-5 hover:cursor-pointer" /> 
                            </button>
                        </div>
                     ) : (
                            <div className="flex gap-4">
                                <PencilIcon className="w-5 h-5 text-slate-700 hover:cursor-pointer" onClick={() => setIsEditOpen(true)}/>
                                <TrashIcon className="w-5 h-5 text-red-500 hover:cursor-pointer" onClick={() => handleDelete()} />
                                <XMarkIcon className="w-5 h-5 text-slate-700 hover:cursor-pointer" onClick={() => setIsOptionsOpen(false)} />
                            </div>
                    )}
            </div>
        </div>
        {isEditOpen && <EditHabitModal habitId={id} habitName={name} habitDays={habitDays} setIsEditOpen={setIsEditOpen} />}
    </div>
 )
}

export default HabitRow