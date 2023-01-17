import React from 'react'
import HabitGrid from './HabitGrid'
import HabitGridContainer from './HabitGridContainer'
import HabitList from './HabitList'
import HabitListContainer from './HabitListContainer'

const HabitContainer = () => {
  return (
    <div className='w-full my-12 px-4 md:px-12 flex flex-col justify-center lg:flex-row gap-4'>
        <HabitGridContainer />
        <HabitListContainer />
    </div>
  )
}

export default HabitContainer