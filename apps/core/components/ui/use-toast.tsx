'use client'

import * as React from 'react'

export function Toaster() {
  return null
}

export function useToast() {
  return {
    toast: (props: any) => console.log('Toast:', props),
  }
}
