import { useEffect } from 'react'

/**
 * Scales the root font size (so every rem-based size scales with it) in proportion to the
 * viewport width, keeping a fixed-width design looking the same on wide screens.
 * `designWidth` is the viewport width at which 1rem equals 16px. Never scales below 16px
 * and the root size is restored on unmount.
 */
export function useScaledRootFont(designWidth: number, maxScale = 2) {
  useEffect(() => {
    const root = document.documentElement
    const previous = root.style.fontSize

    const apply = () => {
      const scale = Math.min(Math.max(window.innerWidth / designWidth, 1), maxScale)
      root.style.fontSize = `${16 * scale}px`
    }
    apply()
    window.addEventListener('resize', apply)

    return () => {
      window.removeEventListener('resize', apply)
      root.style.fontSize = previous
    }
  }, [designWidth, maxScale])
}
