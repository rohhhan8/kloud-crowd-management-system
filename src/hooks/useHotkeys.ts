import { useEffect, useRef } from 'react'

export interface Hotkey {
  /** One key (e.g. "b", "?") or a sequence (e.g. "g" then "o"). */
  keys: readonly string[]
  action: () => void
}

const SEQUENCE_TIMEOUT_MS = 1000

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)
}

/**
 * The single keyboard-shortcut listener. Supports single keys and short sequences; ignores
 * modifier combos and anything typed into form controls.
 */
export function useHotkeys(hotkeys: readonly Hotkey[]) {
  const latest = useRef(hotkeys)
  useEffect(() => {
    latest.current = hotkeys
  })

  useEffect(() => {
    let buffer: string[] = []
    let timer: ReturnType<typeof setTimeout> | undefined

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey || isTypingTarget(event.target)) return
      if (event.key.length !== 1) return

      buffer = [...buffer, event.key.toLowerCase()]
      clearTimeout(timer)
      timer = setTimeout(() => (buffer = []), SEQUENCE_TIMEOUT_MS)

      const matches = latest.current.filter((h) =>
        buffer.every((key, index) => h.keys[index] === key),
      )
      const complete = matches.find((h) => h.keys.length === buffer.length)
      if (complete) {
        event.preventDefault()
        complete.action()
        buffer = []
      } else if (matches.length === 0) {
        buffer = []
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      clearTimeout(timer)
    }
  }, [])
}
