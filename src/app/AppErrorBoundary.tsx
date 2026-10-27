import { Component, type ErrorInfo, type ReactNode } from 'react'
import { ErrorState } from '@/components/shared/ErrorState'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Only the message and component stack; never log state that could hold tokens.
    console.error('Render error:', error.message, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return <ErrorState onRetry={() => this.setState({ hasError: false })} />
    }
    return this.props.children
  }
}
