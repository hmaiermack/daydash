import React, { createContext, useReducer } from 'react'

/*
    Have to initialize selectedTime to null and then check in CalendarContainer whether or not selectedTime has been updated 
    to a Date object. If it has, then we know that the user has clicked on a time slot and we can open the modal.

    If we initialize selectedTime to a Date object and don't check if it's been updated, then the modal will be created on page load with
    stale data, not reflecting that selectedTime has been updated.

    This feels kind of janky
*/

type ReducerState = {
    selectedTime: Date | null;
    isModalOpen: boolean;
}

type ReducerAction = 
    | { type: 'openModal', payload: ReducerState }
    | { type: 'closeModal', payload: ReducerState }

const initialState: ReducerState = {
    selectedTime: null,
    isModalOpen: false,
}

function reducer(state: typeof initialState, action: ReducerAction): ReducerState {
    switch (action.type) {
        case 'openModal':
            return {
                ...state,
                ...action.payload,
            };
        case 'closeModal':
            return {
                ...state,
                ...action.payload,
            };
    }   
}

export const CreateModalContext = createContext<{state: ReducerState, dispatch: React.Dispatch<ReducerAction>}>(
    {
        state: initialState,
        dispatch: () => null
    }
)

export const CreateModalProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    
    return (
        <CreateModalContext.Provider value={{ state, dispatch }}>
            {children}
        </CreateModalContext.Provider>
    )
}