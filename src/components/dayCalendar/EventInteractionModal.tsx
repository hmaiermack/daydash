import { PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { addHours, differenceInMinutes, format, startOfDay, startOfHour } from 'date-fns';
import React, { useContext } from 'react'
import { EditModalContext } from '../../context/EditModalContext';
import determineTextColor from '../../utils/determineTextColor';
import { trpc } from '../../utils/trpc';

export const EventInteractionModal = ({taskId, taskTitle, taskStart, taskEnd, tagId, tagColorValue, tagName, topOffset, colIdx, isModalOpen, setIsModalOpen}: {
    taskId: string;
    taskTitle: string;
    taskStart: Date;
    taskEnd: Date;
    tagId?: string | null;
    tagColorValue?: string | null;
    tagName?: string | null;
    topOffset: number;
    colIdx: number;
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const [hover, setHover] = React.useState(false)
    const [hovered, setHovered] = React.useState<1 | 2 | 3 | null>(null)
    const { dispatch } = useContext(EditModalContext)

    const utils = trpc.useContext()
    const deleteTask = trpc.useMutation('tasks.delete-task', {
        onSuccess: () => {
            utils.invalidateQueries(['tasks.tasks'])
        }
    })
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

    const handleDelete = () => {
        deleteTask.mutate({taskId})
        setIsModalOpen(false)
    }

    const handleEdit = () => {
        console.log(taskTitle)
        tagColorValue && tagName ?
        dispatch({type: 'openModal', payload: {
            eventId: taskId,
            eventTitle: taskTitle,
            startTime: taskStart,
            endTime: taskEnd,
            tagColor: tagColorValue,
            tagName: tagName,
            isEditModalOpen: true,
        }}) : 
        dispatch({type: 'openModal', payload: {
            eventId: taskId,
            eventTitle: taskTitle,
            startTime: taskStart,
            endTime: taskEnd,
            isEditModalOpen: true,
        }})

        setIsModalOpen(false)
    }


    const leftOffset = colIdx >= 3 ? `-304%` : `100%`
    const modalTopOffset = topOffset < 75 ? topOffset : (topOffset - 15)

    return (
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
                                <PencilIcon className='text-gray-600 hover:text-white w-5 h-5' onClick={handleEdit}/>
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
                                <XMarkIcon className='text-gray-600 hover:text-white w-5 h-5' onClick={() => setIsModalOpen(!isModalOpen)}/>
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
                <div className='fixed inset-0 z-[99] w-full h-full' onClick={() => setIsModalOpen(!isModalOpen)}>
                </div>
            </>
    )
    
}
