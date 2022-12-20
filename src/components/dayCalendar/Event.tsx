import { PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { addHours, differenceInMinutes, format, startOfDay, startOfHour } from 'date-fns';
import React from 'react'
import determineTextColor from '../../utils/determineTextColor';
import { trpc } from '../../utils/trpc';

const getEventHeight = (parentHeight: number, steps: number, lengthOfEventInMins: number): number => {
    const totalMinutesForDay = steps * 60

    const percentagePerMinute = parentHeight / totalMinutesForDay

    const height = percentagePerMinute * lengthOfEventInMins
    return height

}

const getTopOffset = (startOfEvent: Date, startOfDay: Date, steps: number): number => {
    const totalMinutesForDay = steps * 60

    const diffInMinutes = differenceInMinutes(startOfEvent, startOfDay)

    // toFixed rounds to two decimals but returns string so have to parse result
    const offset = parseFloat(((diffInMinutes / totalMinutesForDay) * 100).toFixed(2))
    return offset
}

export const Event = ({taskId, taskTitle, taskStart, taskEnd, tagId, tagColorValue, tagName, steps, parentHeight, parentWidth, startHour, parentLeftOffset, colIdx}: {
    taskId: string;
    taskTitle: string;
    taskStart: Date;
    taskEnd: Date;
    tagId?: string | null;
    tagColorValue?: string | null;
    tagName?: string | null;
    steps: number;
    parentHeight: number;
    parentWidth: number;
    parentLeftOffset: number;
    colIdx: number;
    startHour: number
}) => {
    const [hover, setHover] = React.useState(false)
    const [hovered, setHovered] = React.useState<1 | 2 | 3 | null>(null)
    const [isModalOpen, setIsModalOpen] = React.useState(false)

    const utils = trpc.useContext()
    const deleteTask = trpc.useMutation('tasks.delete-task', {
        onSuccess: () => {
            utils.invalidateQueries(['tasks.tasks'])
        }
    })



    const date = new Date

    const eventLength = differenceInMinutes(taskEnd, taskStart)
    const divHeight = getEventHeight(parentHeight, steps, eventLength)


    const start = addHours(startOfDay(taskStart), startHour)
    const topOffset = getTopOffset(taskStart, start, steps)
    //min height to fit title and time on two lines
    const minDivHeight = 40

    const textColor = tagColorValue ? determineTextColor(tagColorValue) : 'black'

    const handleHover = async () => {
        if(!hover) {
            setTimeout(() => {
                setHover(true)
            }, 500)
        } else {
            setTimeout(() => {
                setHover(false)
            }, 500)
        }
    }

    const handleHovered = (hovered: 1 | 2 | 3 | null) => {
        setHovered(hovered)
    }


    const handleClick = () => {
        setIsModalOpen(!isModalOpen)
    }

    const handleDelete = () => {
        deleteTask.mutate({taskId})
        setIsModalOpen(false)
    }


    const leftOffset = colIdx >= 3 ? `-304%` : `100%`
    //110 is approx spacing above cal
    const modalTopOffset = topOffset < 75 ? topOffset : (topOffset - 15)

    return (
        <>
            <button key={taskId} className={`${date > taskEnd ? 'hover:saturate-150 opacity-25' : 'hover:saturate-150'} absolute w-[95%] ${tagColorValue ? '' : 'bg-blue-300'} z-50 flex flex-col overflow-auto rounded-sm`} style={{top: `${topOffset}%`, height: `${divHeight}px`, backgroundColor: tagColorValue ? tagColorValue : ''}} onClick={handleClick}>
                    <span className={`block mt-1 ml-1 text-left font-light text-xs text-${textColor} leading-none`}>
                        {taskTitle}{divHeight > minDivHeight/2 ? <br></br> : ''}{divHeight > minDivHeight ? `${format(taskStart, "h:mm")} - ${format(taskEnd, "hp")}` : ` ${format(taskStart, "h:mm a")}`}
                    </span>
                    {tagName && <pre className={`absolute text-[8px] text-${textColor} bottom-[2px] right-[2px] px-[2px] rounded-sm border border${textColor === "black" ? ' border-black' : "border-white"}`}>{tagName}</pre>}
            </button>


            {isModalOpen &&  
             <>
                <div className={`absolute flex-col rounded drop-shadow-2xl bg-white z-[100]`} style={{width: `300%`, top: `${modalTopOffset}%`, left: leftOffset}}>
                    <div className='flex flex-grow justify-end'>
                        <div className="flex flex-row p-2 gap-2" onMouseLeave={handleHover} onMouseEnter={handleHover}>
                            <div className='relative w-8 h-8 rounded-full flex justify-center items-center hover:cursor-pointer hover:bg-blue-300' onMouseEnter={() => handleHovered(1)} onMouseLeave={() => handleHovered(null)}>
                                {hover && hovered == 1 && 
                                    <div className=' bg-gray-700 text-white text-xs whitespace-nowrap absolute top-9 rounded-sm px-2 py-1'>
                                        Edit event
                                    </div>
                                }
                                <PencilIcon className='text-gray-600 hover:text-white w-5 h-5'/>
                            </div>
                            <div className='relative w-8 h-8 rounded-full flex justify-center items-center hover:cursor-pointer hover:bg-blue-300' onMouseEnter={() => handleHovered(2)} onMouseLeave={() => handleHovered(null)}>
                                <TrashIcon className='text-gray-600 hover:text-white w-5 h-5' onClick={handleDelete}/>
                                {hover && hovered == 2 && 
                                    <div className=' bg-gray-700 text-white text-xs whitespace-nowrap absolute top-9 rounded-sm px-2 py-1'>
                                        Delete event
                                    </div>
                                }
                            </div>
                            <div className='relative w-8 h-8 rounded-full flex justify-center items-center hover:cursor-pointer hover:bg-blue-300' onMouseEnter={() => handleHovered(3)} onMouseLeave={() => handleHovered(null)}>
                                <XMarkIcon className='text-gray-600 hover:text-white w-5 h-5' onClick={handleClick}/>
                                {hover && hovered == 3 && 
                                    <div className=' bg-gray-700 text-white text-xs whitespace-nowrap absolute top-9 rounded-sm px-2 py-1'>
                                        Close
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col px-4 pb-4'>
                        <div className='flex items-center'>
                            {tagColorValue &&
                                <div className={`rounded uppercase tracking-wide text-sm mr-2 font-semibold ${tagColorValue ? `px-2 py-1 text-${determineTextColor(tagColorValue)}` : 'hidden'}`} style={{backgroundColor: tagColorValue ? tagColorValue : ''}}>
                                    {tagName}
                                </div>
                            
                            }
                            <h1 className='text-gray-700 text-2xl tracking-wide'>
                                {taskTitle}
                            </h1>
                        </div>
                        <h2 className='text-gray-700 text-sm tracking-tighter'>
                            {
                                format(taskStart, 'EEEE, MMMM do, h:mm a') + ' - ' + format(taskEnd, 'h:mm a')
                            }
                        </h2>
                    </div>
                </div> 
                <div className='fixed inset-0 z-[99] w-full h-full' onClick={handleClick}>
                </div>
            </>

            }        
        </>
    )
    
}
