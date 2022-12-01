import React, { Dispatch, SetStateAction, useState } from 'react'

const HourMarker = ({timeAndDate, setIsCreateModalOpen, setCreateModalTimeAndDate}: {timeAndDate: Date, setIsCreateModalOpen:Dispatch<SetStateAction<boolean>>, setCreateModalTimeAndDate:Dispatch<SetStateAction<Date>>}) => {

  return (
    <div className='relative hover:bg-slate-100 hover:cursor-pointer' onClick={() => {setIsCreateModalOpen(true); setCreateModalTimeAndDate(timeAndDate)} }>
        <span className='content-none h-[1px] absolute top-0 left-0 bg-gray-200 w-full '></span>
    </div>

  )
}

export default HourMarker