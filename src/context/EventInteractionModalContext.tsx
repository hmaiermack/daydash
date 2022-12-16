import React, { createContext, useReducer } from 'react'

type ReducerState = {
    isEventInteractionModalOpen: boolean;
    referenceTopOffset: number;
    calendarHeight: number;
    referenceLeftOffset: number;
    columnIdx: number;
    referenceWidth: number;
    eventTitle: string;
    eventStart: Date;
    eventEnd: Date;
    eventId: string;
    eventTagName?: string,
    eventTagColor?: string;
}

type ReducerAction = 
    | { type: 'openModal', payload: ReducerState }
    | { type: 'closeModal' }

const initialState: ReducerState = {
    isEventInteractionModalOpen: false,
    referenceTopOffset: 0,
    calendarHeight: 0,
    referenceLeftOffset: 0,
    columnIdx: 0,
    referenceWidth: 0,
    eventTitle: '',
    eventStart: new Date(),
    eventEnd: new Date(),
    eventId: '',
    eventTagName: undefined,
    eventTagColor: undefined
}

//why is code unreachable?
function reducer(state: typeof initialState, action: ReducerAction): ReducerState {
    switch (action.type) {
        case 'openModal':
            return {
                ...state,
                ...action.payload,
            };
        case 'closeModal':
            return {
                ...initialState
            }
    }   
}

export const EventInteractionModalContext = createContext<{state: ReducerState, dispatch: React.Dispatch<ReducerAction>}>(
    {
        state: initialState,
        dispatch: () => null
    }
)

export const EventInteractionModalProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const [isEventInteractionModalOpen, setIsEventInteractionModalOpen] = React.useState(false)
    const [referenceTopOffset, setReferenceTopOffset] = React.useState(0)
    const [referenceLeftOffset, setReferenceLeftOffset] = React.useState(0)
    const [referenceHeight, setReferenceHeight] = React.useState(0)
        {/*
        {
                    isEventInteractionModalOpen, setIsEventInteractionModalOpen, 
                    referenceLeftOffset, setReferenceLeftOffset, 
                    referenceTopOffset, setReferenceTopOffset,
                    referenceHeight, setReferenceHeight
                }
        */}

    return (
        <EventInteractionModalContext.Provider value={{state, dispatch}}>
            {children}
        </EventInteractionModalContext.Provider>
    )
}