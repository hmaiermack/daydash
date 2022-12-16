import { Dialog } from '@headlessui/react'
import { PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { format } from 'date-fns'
import React, { useContext, useRef } from 'react'
import { EventInteractionModalContext } from '../../context/EventInteractionModalContext'
import determineTextColor from '../../utils/determineTextColor'

const EventInteractionModal = () => {
    const { state, dispatch } = useContext(EventInteractionModalContext)
    const [hover, setHover] = React.useState(false)
    const [hovered, setHovered] = React.useState<1 | 2 | 3 | null>(null)
    const [topOffset, setTopOffset] = React.useState(0)
    const ref = useRef<HTMLDivElement>(null)

    const color = state.eventTagColor

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
        setHovered(null)
        setHovered(hovered)
    }
    

    React.useLayoutEffect(() => {
        if(ref.current){
            const diff = state.calendarHeight - state.referenceTopOffset
            diff > ref.current.clientHeight ?
            setTopOffset(state.referenceTopOffset + 72) :
            setTopOffset(state.calendarHeight - diff)
        }
    }, [ref])



    //depending on what day column event is in, modal will be positioned to the right or left of event
    //if fourth column or more: modal will move left (towards 0) by 3 times the width of columns (modal width is 3x width of a column)
    //this moves the right edge of the modal to the left edge of the event, we subtract 4px for a small gap

    //if first, second or third column: modal will move right (towards 100%) by the width of a column
    //this moves the left edge of the modal to the right edge of the event, we add 4px for a small gap
    const leftOffset = state.columnIdx >= 3 ? state.referenceLeftOffset - (3*state.referenceWidth) - 4 : state.referenceLeftOffset + state.referenceWidth + 4

    
  return (
    <>
    {state.isEventInteractionModalOpen && 
        <Dialog open={state.isEventInteractionModalOpen} onClose={() => dispatch({type: "closeModal"})} className="z-[100] relative" >
            {/* Prevent opening createModal when clicking outside of EventInteractionModal w/ overlay */}
            <div className="fixed inset-0" />
            <div className='fixed' style={{top: topOffset, left: leftOffset}}>
                <Dialog.Panel className="relative" >
                    <div className={`fixed flex-col rounded drop-shadow-2xl bg-white`} ref={ref} style={{width: state.referenceWidth * 3}}>
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
                                    <TrashIcon className='text-gray-600 hover:text-white w-5 h-5' />
                                    {hover && hovered == 2 && 
                                        <div className=' bg-gray-700 text-white text-xs whitespace-nowrap absolute top-9 rounded-sm px-2 py-1'>
                                            Delete event
                                        </div>
                                    }
                                </div>
                                <div className='relative w-8 h-8 rounded-full flex justify-center items-center hover:cursor-pointer hover:bg-blue-300' onMouseEnter={() => handleHovered(3)} onMouseLeave={() => handleHovered(null)}>
                                    <XMarkIcon className='text-gray-600 hover:text-white w-5 h-5' onClick={() => dispatch({type: "closeModal"})}/>
                                    {hover && hovered == 3 && 
                                        <div className=' bg-gray-700 text-white text-xs whitespace-nowrap absolute top-9 rounded-sm px-2 py-1'>
                                            Close
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col pl-4 pb-4'>
                            <div className='flex items-center'>
                                <div className={`rounded uppercase tracking-wide text-sm mr-2 font-semibold ${state.eventTagColor ? `px-2 py-1 text-${determineTextColor(state.eventTagColor)}` : 'hidden'}`} style={{backgroundColor: state.eventTagColor ? state.eventTagColor : ''}}>
                                    {state.eventTagName}
                                </div>
                                <h1 className='text-gray-700 text-2xl tracking-wide'>
                                    {state.eventTitle}
                                </h1>
                            </div>
                            <h2 className='text-gray-700 text-sm tracking-tighter'>
                                {
                                //format using datefns format() method: state.eventStart and state.eventEnd so that it reads like this: Day, Month Day of Month, Hour:Minute AM/PM - Hour:Minute AM/PM
                                    format(state.eventStart, 'EEEE, MMMM do, h:mm a') + ' - ' + format(state.eventEnd, 'h:mm a')
                                }
                            </h2>
                        </div>
                    </div> 
                </Dialog.Panel>
            </div>
    
        </Dialog>
    
    }
  </>
  )
}

export default EventInteractionModal