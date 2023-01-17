import React from 'react'
import { HabitErrorBoundary } from './HabitErrorBoundary'
import HabitGrid from './HabitGrid'

const HabitGridContainer = () => {
  return (
    <div className="w-full lg:w-5/12">
        <HabitErrorBoundary>
            <HabitGrid />
        </HabitErrorBoundary>
    </div>
  )
}

export default HabitGridContainer