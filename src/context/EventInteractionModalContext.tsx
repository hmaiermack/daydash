import React, { createContext, useReducer } from 'react'

type ReducerState = {
}

type ReducerAction = 
    | { type: 'openModal', payload: { } }

const initialState: ReducerState = {
}

function reducer(state: typeof initialState, action: ReducerAction): ReducerState {
    switch (action.type) {
        case 'openModal':
            return {
                ...state,
                ...action.payload,
            };
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
    return (
        <EventInteractionModalContext.Provider value={{state, dispatch}}>
            {children}
        </EventInteractionModalContext.Provider>
    )
}