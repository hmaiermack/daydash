import React, { useEffect } from 'react'
import { CreateModalContext, CreateModalContextType } from '../../context/modalContext';

const HourMarker = ({timeAndDate}: {timeAndDate: Date}) => {
  const {setIsCreateModalOpen, setSelectedTime, selectedTime} = React.useContext(CreateModalContext) as CreateModalContextType

  const handleClick = () => {
    setSelectedTime(timeAndDate)
  }

  useEffect(() => {
    setIsCreateModalOpen(true)
  }, [selectedTime])
  
  return (
    <div className='relative hover:bg-slate-100 hover:cursor-pointer' onClick={handleClick}>
        <span className='content-none h-[1px] absolute top-0 left-0 bg-gray-200 w-full '></span>
    </div>

  )
}

export default HourMarker