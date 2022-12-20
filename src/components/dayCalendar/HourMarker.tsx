import React, { useEffect } from 'react'
import { CreateModalContext } from '../../context/modalContext';

const HourMarker = ({timeAndDate}: {timeAndDate: Date}) => {
  const {state, dispatch} = React.useContext(CreateModalContext)

  const handleClick = () => {
    dispatch({type: 'openModal', payload: {selectedTime: timeAndDate, isModalOpen: true}})
  }
  
  return (
    <div className='relative hover:bg-slate-100 hover:cursor-pointer' onClick={handleClick}>
        <span className='content-none h-[1px] absolute top-0 left-0 bg-gray-200 w-full '></span>
    </div>
  )
}

export default HourMarker