import { Switch } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { Fragment, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { trpc } from "../../utils/trpc";
import { useZodForm } from "../../utils/zodForm";
import { ItemListErrorBoundary } from "./ItemListErrorBoundary";

function ItemList({ children }: { children: React.ReactNode }) {
return (
    <div className="bg-slate-100 rounded py-2 px-4 md:min-h-[20rem] flex-grow flex flex-col">
        <ItemListErrorBoundary>
            {children}
        </ItemListErrorBoundary>
    </div>
)
}

export default ItemList