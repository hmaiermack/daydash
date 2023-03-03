import { CheckIcon } from "@heroicons/react/20/solid";
import React from "react";
import { toast } from "react-hot-toast";
import { trpc } from "../../utils/trpc";

interface IItemRowCheckButtonProps {
    isComplete: boolean,
    id: string,
    toggleFn: any,
}

function ItemRowCheckButton({isComplete, id, toggleFn}: IItemRowCheckButtonProps) {

    const handleClick = () => {
        console.log("toggling")
        toggleFn.mutate({isComplete, id})
        toggleFn.isLoading && toast.loading('Loading...')
    }

    return (
        <button aria-label="toggle habit" onClick={toggleFn}><CheckIcon className={`w-5 h-5 border border-slate-400 font-extrabold rounded-sm transition ease-in-out delay-75 hover:scale-110 hover:-translate-y-[2px] ${isComplete ? `bg-green-400 hover:bg-red-400 text-white border-none` : 'hover:bg-green-400 hover:text-white hover:border-none'}`}/></button>
    )
}

export default ItemRowCheckButton