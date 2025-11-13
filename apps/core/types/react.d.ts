import 'react'

declare module 'react' {
  // Extend ReactNode to fix @dnd-kit type compatibility
  type ReactNode = React.ReactNode
}
