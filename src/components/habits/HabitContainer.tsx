import React from 'react'
import HabitGrid from './HabitGrid'
import HabitList from './HabitList'

const HabitContainer = () => {
  return (
    <div className='w-full my-12 px-12 max-w-7xl flex flex-col lg:flex-row'>
        <HabitGrid />
    </div>
  )
}

export default HabitContainer