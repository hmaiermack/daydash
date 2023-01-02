import React from 'react'
import HabitGrid from './HabitGrid'
import HabitList from './HabitList'

const HabitContainer = () => {
  return (
    <div className='w-full my-12 px-4 md:px-12 flex flex-col justify-center lg:flex-row gap-4'>
        <HabitGrid />
        <HabitList />
    </div>
  )
}

export default HabitContainer