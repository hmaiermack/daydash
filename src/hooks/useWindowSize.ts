import { useEffect, useState } from 'react'

// See: https://usehooks-ts.com/react-hook/use-event-listener
import useEventListener from './useEventListener'
// See: https://usehooks-ts.com/react-hook/use-isomorphic-layout-effect
import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect'

interface WindowSize {
  width: number | undefined
  height: number | undefined
}

function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
  })

  const handleSize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    })
  }

  useEventListener('resize', handleSize)

  // Set size at the first client-side load
  useEffect(() => {
    handleSize()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return windowSize
}

export default useWindowSize
