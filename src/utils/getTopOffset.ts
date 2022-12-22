import { differenceInMinutes } from "date-fns"

export const getTopOffset = (startOfEvent: Date, startOfDay: Date, steps: number): number => {
    const totalMinutesForDay = steps * 60

    const diffInMinutes = differenceInMinutes(startOfEvent, startOfDay)

    // toFixed rounds to two decimals but returns string so have to parse result
    const offset = parseFloat(((diffInMinutes / totalMinutesForDay) * 100).toFixed(2))
    return offset
}
