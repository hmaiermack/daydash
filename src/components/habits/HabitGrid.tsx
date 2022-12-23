import { subMonths, format } from "date-fns";
import React from "react";
import ActivityCalendar, { Day } from "react-activity-calendar";
import { GraphDay } from "../../../types/types";

function HabitGrid () {
    // assuming 3 habits daily would expect:
    // 1/3 habits completed on a day - level = 2
    // 2/3 habits - level = 3
    // 3/3 habits - level = 4

    // handle level equation on backend so we don't have to do it here
    // number of habits divided by count will give us a decimal to determine level
    // different days will have different habits
    // so something like: <habits completed on day> / <total habits for day>
    // should give proper result
    // if count = 0 -> level = 0
    // else
    // 0.01-.33 level = 1
    // 0.33-.66 level = 2
    // 0.66-.99 level = 3
    // 1 level = 4

    // backend placeholders
    const totalAdherence = 87
    // first day three months prior on the first of the month
    const startOfGrid = format(subMonths(Date.now(), 1), "yyyy-MM-dd")
    

    const days: GraphDay[] = [
        {
            date: startOfGrid,
            count: 0,
            level: 0
        },
        {
            date: "2022-10-01",
            count: 3,
            level: 4
        },
        {
            date: "2022-10-02",
            count: 2,
            level: 3
        },
        {
            date: "2022-10-03",
            count: 3,
            level: 4
        },
        {
            date: "2022-10-04",
            count: 1,
            level: 1
        },
        {
            date: format(Date.now(), "yyyy-MM-dd"),
            count: 0,
            level: 0
        },
    ]


    return (
        <div className="w-full lg:w-5/12 bg-blue-200 p-4 flex flex-col justify-center items-center gap-1 rounded text-left">
            <div className="block text-left">
              <h2 className="font-semibold text-lg my-1">Habit Tracker</h2>
              <p className="font-light text-sm mb-4 text-left">See how  well you&#39;ve adhered to your habits in the past {'x'} months.</p>
            </div>

            <ActivityCalendar 
            blockMargin={2}
            blockSize={12}
            fontSize={12}
            hideColorLegend
            hideTotalCount
            data={days} 
              labels={{
                legend: {
                  less: 'Less',
                  more: 'More'
                },
                months: [
                  'Jan',
                  'Feb',
                  'Mar',
                  'Apr',
                  'May',
                  'Jun',
                  'Jul',
                  'Aug',
                  'Sep',
                  'Oct',
                  'Nov',
                  'Dec'
                ],
                // totalCount: `${totalAdherence}% adherence since ${format(subMonths(Date.now(), 6), "MMM do")}`,
                weekdays: [
                  'Sun',
                  'Mon',
                  'Tue',
                  'Wed',
                  'Thu',
                  'Fri',
                  'Sat'
                ]
              }}
            />
        </div>
    )
}

export default HabitGrid