/** Single source for shortcut keys and their help text. */
export const HOTKEYS = {
  overview: { keys: ['g', 'o'], description: 'Go to Overview' },
  entries: { keys: ['g', 'e'], description: 'Go to Crowd Entries' },
  alerts: { keys: ['b'], description: 'Open alerts' },
  help: { keys: ['?'], description: 'Show keyboard shortcuts' },
} as const
