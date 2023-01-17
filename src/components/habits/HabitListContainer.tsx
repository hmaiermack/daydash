import React from 'react'
import { HabitErrorBoundary } from './HabitErrorBoundary'
import HabitList from './HabitList'

const HabitListContainer = () => {
  return (
    <div className="flex-grow">
    <HabitErrorBoundary>
        <HabitList />
    </HabitErrorBoundary>
</div>

  )
}

export default HabitListContainer