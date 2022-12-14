import { Dialog } from '@headlessui/react'
import React, { useContext } from 'react'
import { EventInteractionModalContext, EventInteractionModalContextType } from '../../context/EventInteractionModalContext'

const EventInteractionModal = () => {
    const { referenceLeftOffset, referenceTopOffset, isEventInteractionModalOpen, setIsEventInteractionModalOpen } = useContext(EventInteractionModalContext) as EventInteractionModalContextType

  return (
    <Dialog open={isEventInteractionModalOpen} onClose={() => setIsEventInteractionModalOpen(false)} className="z-[100] relative" >
        <div className='fixed' style={{top: referenceTopOffset, left: referenceLeftOffset}}>
            <Dialog.Panel className="relative" >
                <div className='fixed block content-none w-60 h-28 bg-red-500'>asdad</div> 
            </Dialog.Panel>
        </div>

    </Dialog>
  )
}

export default EventInteractionModal