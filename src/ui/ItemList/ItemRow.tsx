import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon, PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { PrismaClient } from "@prisma/client";
import { TRPCClientErrorLike } from "@trpc/client";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { type Router } from "next/router";
import React, { Fragment, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { UseMutationResult } from "react-query";
import { trpc } from "../../utils/trpc";
import ItemRowCheckButton from "./ItemRowCheckButton";
// import EditHabitModal from "./EditHabitModal";
// import HabitCheckButton from "./HabitCheckButton";

type ItemWithBaseProperties = {
    id: string;
    name: string;
    [key: string]: any;
}


function ItemRow<T extends ItemWithBaseProperties>({ item, deleteFn, toggleFn }: { item: T, deleteFn: any, toggleFn: any } & React.ComponentPropsWithoutRef<"div">) {
    const [isOptionsOpen, setIsOptionsOpen] = React.useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)

    const utils = trpc.useContext()

    const deleteHabit = trpc.useMutation(["habits.delete-habit"], {
        //@ts-ignore
        onError: (err) => {
            toast.error("Something went wrong. Please try again later.")
        },
        onSuccess() {
            utils.invalidateQueries(["habits.habits"])
            toast.success("Habit deleted!")
            setIsOptionsOpen(false)
        },
    })


 return (
    <div className="flex md:w-64">
        <div className="flex w-full bg-white border border-slate-300 p-2 rounded items-center justify-between">
            <div className="flex items-start justify-start max-w-fit overflow-hidden">
                <span className="whitespace-nowrap ">
                    {item.name} 
                    {item.remindTime &&  <span className="text-gray-500 text-sm ml-2">{item.remindTime}</span>}
                </span>
            </div>
            <div className="flex items-center">
                    {!isOptionsOpen ? (
                        <div className="flex items-center">
                            <ItemRowCheckButton isComplete={item.isCompleted} id={item.id} toggleFn={toggleFn} />
                            <button onClick={() => setIsOptionsOpen(true)}>
                                <EllipsisVerticalIcon className="w-5 h-5 hover:cursor-pointer" /> 
                            </button>
                        </div>
                     ) : (
                            <div className="flex gap-4">
                                <PencilIcon className="w-5 h-5 text-slate-700 hover:cursor-pointer" onClick={() => setIsEditOpen(true)}/>
                                <TrashIcon className="w-5 h-5 text-red-500 hover:cursor-pointer" onClick={deleteFn} />
                                <XMarkIcon className="w-5 h-5 text-slate-700 hover:cursor-pointer" onClick={() => setIsOptionsOpen(false)} />
                            </div>
                    )}
            </div>
        </div>
        {/* {isEditOpen && <EditHabitModal habitId={id} habitName={name} habitDays={habitDays} setIsEditOpen={setIsEditOpen} />} */}
    </div>
 )
}

export default ItemRow