'use client'

import { ReactNode } from 'react'
import Sidebar from '../admin/Sidebar'
import TopBar from './TopBar'

interface MainLayoutProps {
  children: ReactNode
  user: {
    id?: string
    email?: string
    nome?: string
    role?: string
    avatar_url?: string
  }
}

export default function MainLayout({ children, user }: MainLayoutProps) {
  // Garantir que o user tem todas as propriedades necessárias
  const fullUser = {
    id: user.id || '',
    nome: user.nome || null,
    email: user.email || '',
    role: user.role || 'user',
    avatar_url: user.avatar_url || null,
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={fullUser} />
      
      <div className="flex-1 flex flex-col">
        <TopBar user={user} />
        
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
