import React, { useEffect } from "react";
import ActivityCalendar from "react-activity-calendar";
import { trpc } from "../../utils/trpc";

function HabitGrid () {
  const { data, isLoading } = trpc.useQuery(['habits.habit-graph'])


    return (
        <div className="w-full lg:w-5/12 bg-blue-200 p-4 flex flex-col justify-center items-center gap-1 rounded text-left">
            <div className="block text-left">
              <h2 className="font-semibold text-lg my-1">Habit Tracker</h2>
              <p className="font-light text-sm mb-4 text-left">See how  well you&#39;ve adhered to your habits in the past 6 months.</p>
            </div>
            {data &&
              <ActivityCalendar 
              blockMargin={2}
              blockSize={12}
              loading={isLoading}
              fontSize={12}
              hideColorLegend
              hideTotalCount
              data={data?.intervalData} 
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
            }
        </div>
    )
}

export default HabitGrid