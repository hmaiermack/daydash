import { Tag, Task } from "@prisma/client";
import { addHours, eachDayOfInterval, eachHourOfInterval, isSameDay } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { CalendarContext } from "../context/CalendarContext";
import { trpc } from "../utils/trpc";

function useCreateColumns (
    taskData: {
        timeRangeStart: number;
        timeRangeEnd: number;
        tasks: (Task & {
            tag: {
                name: string;
                colorHexValue: string;
            } | null;
        })[];
        tags: Tag[];
    } | undefined,
    days: Date[]

) {
    const { state: CalendarState } = useContext(CalendarContext)


    const cols: (Task & {
        tag: {
            name: string;
            colorHexValue: string;
        } | null;
    })[][] = []

    const [data, setData] = useState(() => [...cols])

    let hours: Date[] = []

      if(taskData) {
    hours = eachHourOfInterval({start: addHours(CalendarState.dateRangeStart, taskData?.timeRangeStart), end: addHours(CalendarState.dateRangeStart, taskData?.timeRangeEnd - 1)})
  }
    useEffect(() => {
        if(taskData?.tasks != undefined) {
            //this is nasty
            //probably should just get userInfo from api and make it available to whole app
            //alternatively could pass it thru tasks.task as an object {timeStart, timeEnd, tasks: [...]}?
                let taskArr = taskData.tasks
                days.forEach((day, idx) => {
                    let temp: (Task & {
                        tag: {
                            name: string;
                            colorHexValue: string;
                        } | null;
                    })[] = []
                    taskArr.forEach((task, index) => {
                        if(isSameDay(task!.timeStart, day) && task) {
                            temp = [...temp, task]
                        }
                    })
                    cols[idx] = temp
                })
            setData([...cols])
          }
          //eslint-disable-next-line
    }, [taskData, CalendarState.display])


    return {columns: data}

}

export default useCreateColumns;