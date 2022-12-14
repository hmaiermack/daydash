import React, { createContext } from 'react'

export type EventInteractionModalContextType = {
    isEventInteractionModalOpen: boolean;
    setIsEventInteractionModalOpen: (isOpen: boolean) => void;
    referenceTopOffset: number;
    referenceLeftOffset: number;
    setReferenceTopOffset: (topOffset: number) => void;
    setReferenceLeftOffset: (leftOffset: number) => void;
}

export const EventInteractionModalContext = createContext<EventInteractionModalContextType | null>(null)

export const EventInteractionModalProvider = ({ children }: { children: React.ReactNode }) => {
    const [isEventInteractionModalOpen, setIsEventInteractionModalOpen] = React.useState(false)
    const [referenceTopOffset, setReferenceTopOffset] = React.useState(0)
    const [referenceLeftOffset, setReferenceLeftOffset] = React.useState(0)

    return (
        <EventInteractionModalContext.Provider value={{isEventInteractionModalOpen, setIsEventInteractionModalOpen, referenceLeftOffset, setReferenceLeftOffset, referenceTopOffset, setReferenceTopOffset} }>
            {children}
        </EventInteractionModalContext.Provider>
    )
}