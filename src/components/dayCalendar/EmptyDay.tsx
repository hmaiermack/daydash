import React from 'react'

export const EmptyDay = ({screenWidth}: {screenWidth: number}) => {
  return (
    <div className='h-20 w-52 bg-gray-50 flex flex-col justify-center items-center translate-y-11 relative'>
            <span className='text-xs font-extralight'>Add event</span>
    </div>
  )
}
