import { useEffect } from 'react'

const APP_NAME = 'Crowd Management System'

export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = `${title} | ${APP_NAME}`
    return () => {
      document.title = APP_NAME
    }
  }, [title])
}
