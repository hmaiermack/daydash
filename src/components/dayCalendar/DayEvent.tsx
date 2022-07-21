import React from 'react'

export const DayEvent = ({taskId, taskTitle, taskStart, taskEnd, tagId, tagColorValue, tagName}: {
    taskId: string;
    taskTitle: string;
    taskStart: Date;
    taskEnd: Date;
    tagId?: string | undefined;
    tagColorValue?: string | undefined;
    tagName?: string | undefined;
}) => {
    return (
        <div className='h-20 w-52 bg-blue-300 flex flex-col justify-between items-center translate-y-11 relative'>
                <div className='mt-2 font-medium text-gray-700'>{taskTitle}</div>
                <div className='flex justify-between w-full p-2'>
                    <span className='text-white text-xs p-1 border rounded-sm'>Edit</span>
                    <span className='text-red-300 text-xs p-1 border border-red-300 rounded-sm'>Delete</span>
                </div>
        </div>
      )
    
}
