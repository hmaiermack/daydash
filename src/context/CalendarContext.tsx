import { endOfDay, isSaturday, isSunday, nextSaturday, previousSunday, startOfDay } from 'date-fns'
import React, { createContext, useReducer } from 'react'

type ReducerState = {
    display?: "one" | "three" | "week",
    dateRangeStart: Date,
    dateRangeEnd: Date,
    today?: Date,
    filterByTagName?: string,
}

type ReducerActions = 
    | { type: 'moveTimeForward', payload: ReducerState }
    | { type: 'moveTimeBackward', payload: ReducerState }
    | { type: 'changeDisplay', payload: ReducerState }
    | { type: 'changeFilter', payload: ReducerState }

const initialState: ReducerState = {
    display: "week",
    dateRangeStart: isSunday(new Date)? startOfDay(new Date) : startOfDay(previousSunday(new Date)),
    dateRangeEnd: isSaturday(new Date) ? endOfDay(new Date) : endOfDay(nextSaturday(new Date)),
    today: new Date()
}

function reducer(state: typeof initialState, action: ReducerActions): ReducerState {
    switch (action.type) {
        case 'moveTimeForward':
            return {
                ...state,
                ...action.payload,
            };
        case 'moveTimeBackward':
            return {
                ...state,
                ...action.payload,
            };
        case 'changeDisplay':
            return {
                ...state,
                ...action.payload,
            }
        case 'changeFilter':
            return {
                ...state,
                ...action.payload,
            }
    }   
}

export const CalendarContext = createContext<{state: ReducerState, dispatch: React.Dispatch<ReducerActions>}>(
    {
        state: initialState,
        dispatch: () => null
    }
)

export const CalendarContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    return (
        <CalendarContext.Provider value={{state, dispatch}}>
            {children}
        </CalendarContext.Provider>
    )
}