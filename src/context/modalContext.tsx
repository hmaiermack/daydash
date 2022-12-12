import React, { createContext } from 'react'

/*
    Have to initialize selectedTime to null and then check in CalendarContainer whether or not selectedTime has been updated 
    to a Date object. If it has, then we know that the user has clicked on a time slot and we can open the modal.

    If we initialize selectedTime to a Date object and don't check if it's been updated, then the modal will be created on page load with
    stale data, not reflecting that selectedTime has been updated.

    This feels kind of janky, but I'm not sure how else to do it ATM.
*/

export type CreateModalContextType = {
    isCreateModalOpen: boolean;
    selectedTime: Date | null;
    setIsCreateModalOpen: (isOpen: boolean) => void;
    setSelectedTime: (selectedTime: Date | null) => void;
}

export const CreateModalContext = createContext<CreateModalContextType | null>(null)

export const CreateModalProvider = ({ children }: { children: React.ReactNode }) => {
    const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)
    const [selectedTime, setSelectedTime] = React.useState<Date | null>(null)

    return (
        <CreateModalContext.Provider value={{ isCreateModalOpen, selectedTime, setIsCreateModalOpen, setSelectedTime }}>
            {children}
        </CreateModalContext.Provider>
    )
}